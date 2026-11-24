-- Velos Update 71 (part A): online-signed agreements for restaurants / vendors
insert into storage.buckets (id, name, public) values ('signed-agreements','signed-agreements',false) on conflict (id) do nothing;

create table if not exists public.signed_agreements(
  id bigserial primary key,
  user_id uuid not null default auth.uid(),
  kind text not null,
  path text not null,
  signed_name text,
  ref text,
  business text,
  signed_at timestamptz not null default now()
);
alter table public.signed_agreements enable row level security;
revoke all on public.signed_agreements from anon, public;

drop policy if exists "signed agreements upload own" on storage.objects;
create policy "signed agreements upload own" on storage.objects for insert to authenticated
  with check (bucket_id='signed-agreements' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "signed agreements read own" on storage.objects;
create policy "signed agreements read own" on storage.objects for select to authenticated
  using (bucket_id='signed-agreements' and ((storage.foldername(name))[1] = auth.uid()::text or coalesce(public.is_manager(), false)));

create or replace function public.my_signed_agreement(p_kind text)
returns table(path text, signed_name text, signed_at timestamptz)
language sql security definer set search_path=public as $$
  select path, signed_name, signed_at from public.signed_agreements
  where user_id=auth.uid() and kind=p_kind order by signed_at desc limit 1;
$$;

create or replace function public.sign_agreement_save(p_kind text, p_path text, p_name text, p_ref text, p_business text)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if p_kind not in ('restaurant','partner') then raise exception 'Bad kind'; end if;
  if p_path is null or split_part(p_path,'/',1) <> auth.uid()::text then raise exception 'Bad path'; end if;
  insert into public.signed_agreements(user_id,kind,path,signed_name,ref,business) values (auth.uid(),p_kind,p_path,left(p_name,120),left(p_ref,60),left(p_business,160));
end $$;

create or replace function public.admin_signed_agreements()
returns table(id bigint, kind text, path text, signed_name text, ref text, business text, signed_at timestamptz)
language plpgsql security definer set search_path=public as $$
begin
  if not coalesce(is_manager(), false) then raise exception 'Managers only'; end if;
  return query select s.id,s.kind,s.path,s.signed_name,s.ref,s.business,s.signed_at from public.signed_agreements s order by s.signed_at desc limit 500;
end $$;

revoke execute on function public.my_signed_agreement(text), public.sign_agreement_save(text,text,text,text,text), public.admin_signed_agreements() from public, anon;
grant execute on function public.my_signed_agreement(text), public.sign_agreement_save(text,text,text,text,text), public.admin_signed_agreements() to authenticated;
notify pgrst, 'reload schema';
