-- =====================================================================
-- VELOS UPGRADE 65 | Pay first.
--  * Velos Global Shop, Fashion, Little Stars and the Velos Foods Store: payment is required BEFORE
--    the order is processed. Cash on delivery is refused by the database, not only hidden on the page.
--  * Every Velos Partner (goods seller) chooses at registration: "customer pays first" (default)
--    or "pay on delivery". Hotels, venues and restaurants are NOT changed.
--  * Pay-on-delivery safety: only for orders up to a limit (default UGX 1,000,000, adjustable), and Velos cannot
--    pay the seller for such an order until you mark the customer's money as received.
-- Safe to run more than once. Paste ALL of it into Supabase > SQL Editor > Run.
-- =====================================================================

insert into public.settings(key, value) values ('rule_cod_max_ugx', '1000000')
on conflict (key) do nothing;
-- the old "small orders prepaid / big orders cash" rule is replaced: every Velos-owned order is prepaid
update public.settings set value = '1000000000000' where key = 'rule_pay_advance_below';

alter table public.partners       add column if not exists payment_terms text default 'prepaid';
alter table public.partner_orders add column if not exists pay_terms text;
alter table public.partner_orders add column if not exists cod_received boolean not null default false;
update public.partners set payment_terms = 'prepaid' where payment_terms is null;

-- ---------- partner orders follow the seller's terms ----------
create or replace function public.velos_po_terms() returns trigger
language plpgsql security definer set search_path = public as $$
declare pr record; mx numeric;
begin
  select kind, coalesce(payment_terms, 'prepaid') as pt into pr from partners where id = new.partner_id;
  if pr.kind is null or pr.kind <> 'goods' then return new; end if;   -- hotels and venues keep their own rules
  select coalesce(nullif(value, '')::numeric, 1000000) into mx from settings where key = 'rule_cod_max_ugx';
  if pr.pt = 'cod' and new.total_ugx <= coalesce(mx, 1000000) then
    new.pay_terms := 'cod';
    new.deposit_required_ugx := 0;
    new.payment_status := 'confirmed';      -- cleared for the seller to prepare; the money is collected on delivery
  else
    new.pay_terms := 'prepaid';
    new.deposit_required_ugx := new.total_ugx;   -- full payment before the seller is told
  end if;
  return new;
end $$;
drop trigger if exists velos_po_terms_trg on public.partner_orders;
create trigger velos_po_terms_trg before insert on public.partner_orders
for each row execute function public.velos_po_terms();

-- Velos cannot pay out a pay-on-delivery order until the customer's money is marked received
create or replace function public.velos_po_cod_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.payout_id is not null and old.payout_id is null and new.pay_terms = 'cod' and not new.cod_received then
    raise exception 'Order #% is pay-on-delivery and the customer money is not marked received yet. Open Partner orders, mark it received, then create the payout.', new.order_no;
  end if;
  return new;
end $$;
drop trigger if exists velos_po_cod_guard_trg on public.partner_orders;
create trigger velos_po_cod_guard_trg before update of payout_id on public.partner_orders
for each row execute function public.velos_po_cod_guard();

create or replace function public.admin_cod_received(p_no bigint) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not is_manager() then raise exception 'Managers only'; end if;
  update partner_orders set cod_received = true, amount_paid_ugx = total_ugx where order_no = p_no and pay_terms = 'cod';
  return found;
end $$;

-- ---------- choosing and reading the terms ----------
create or replace function public.partner_pay_terms(p_partner uuid) returns text
language sql stable security definer set search_path = public as $$
  select coalesce(payment_terms, 'prepaid') from partners where id = p_partner and status = 'active' $$;
grant execute on function public.partner_pay_terms(uuid) to anon, authenticated;

create or replace function public.choose_payment_terms(p_terms text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := auth.uid(); v uuid; st text; kd text;
begin
  if u is null then raise exception 'Please sign in first.'; end if;
  if p_terms not in ('prepaid', 'cod') then raise exception 'Choose customer pays first, or pay on delivery.'; end if;
  select id, status, kind into v, st, kd from partners where owner_uid = u limit 1;
  if v is null then raise exception 'No application found.'; end if;
  if kd <> 'goods' then return jsonb_build_object('ok', true, 'terms', 'not_applicable'); end if;
  if st = 'active' then raise exception 'Your business is already approved. Ask Velos to change your payment terms.'; end if;
  update partners set payment_terms = p_terms where id = v;
  return jsonb_build_object('ok', true, 'terms', p_terms);
end $$;
grant execute on function public.choose_payment_terms(text) to authenticated;

create or replace function public.my_payment_terms() returns text
language sql stable security definer set search_path = public as $$
  select case when kind = 'goods' then coalesce(payment_terms, 'prepaid') else null end from partners where owner_uid = auth.uid() limit 1 $$;
grant execute on function public.my_payment_terms() to authenticated;

create or replace function public.admin_set_payment_terms(p_id uuid, p_terms text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not is_manager() then raise exception 'Managers only'; end if;
  if p_terms not in ('prepaid', 'cod') then raise exception 'Bad option'; end if;
  update partners set payment_terms = p_terms where id = p_id;
  return true;
end $$;
grant execute on function public.admin_set_payment_terms(uuid, text) to authenticated;

-- ---------- Velos-owned shops: refuse cash on delivery at the database ----------
create or replace function public.velos_orders_prepaid() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(to_jsonb(new)->>'payment_method', '') ~* '(cash|on delivery|collection)' and not coalesce(is_manager(), false) then
    raise exception 'Payment is required before we process an order. Please pay by MTN or Airtel Mobile Money.';
  end if;
  return new;
end $$;
drop trigger if exists velos_orders_prepaid_trg on public.orders;
create trigger velos_orders_prepaid_trg before insert on public.orders
for each row execute function public.velos_orders_prepaid();

create or replace function public.velos_store_prepaid() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(to_jsonb(new)->>'payment_method', '') ~* 'cash' and not coalesce(is_manager(), false)
     and exists (select 1 from food_vendors v where v.id::text = to_jsonb(new)->>'vendor_id' and coalesce(v.kind, 'restaurant') = 'store') then
    raise exception 'Velos Foods Store orders are paid before we pack them. Please pay by MTN or Airtel Mobile Money.';
  end if;
  return new;
end $$;
drop trigger if exists velos_store_prepaid_trg on public.food_orders;
create trigger velos_store_prepaid_trg before insert on public.food_orders
for each row execute function public.velos_store_prepaid();

notify pgrst, 'reload schema';

-- REPORT: how each partner is set up
select business_name, kind, status, coalesce(payment_terms, 'prepaid') as customer_pays from public.partners order by 1;
