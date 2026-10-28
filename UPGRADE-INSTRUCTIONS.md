# Velos Foods launch upgrade — deployment notes

## Included changes
- Refreshed the Velos Foods customer landing header and restaurant selector.
- Restaurant selector can display a restaurant logo when `food_vendors.logo_url` is populated and publicly readable.
- Restaurant partner portal includes a Restaurant profile tab for uploading/updating its own logo.
- Admin > Restaurants includes a logo upload control.
- Admin > Settings includes a restaurant registration fee field. Set it to `0` for the free pilot.
- Restaurant application copy now says registration is free during the launch pilot; the application flow no longer asks new applicants to pay a fee.
- Admin > Photos shows a catalogue image-status count and explains how to upload images directly through the admin dashboard.
- `clover-logo.png` is a crop of the Clover logo from the menu PDF supplied by the owner.
- `velos-food-branding-upgrade.sql` adds the logo field, creates the public logo bucket and logo upload policies, adds the secure restaurant logo update RPC, and sets the registration fee setting to zero.

## Apply safely
1. Download and keep a backup of the current GitHub repository.
2. Open Supabase Dashboard → SQL Editor.
3. Review and run `velos-food-branding-upgrade.sql` against the existing project. Do not run it against a different Supabase project.
4. In the Supabase Table Editor, confirm `food_vendors.logo_url` exists and the `food-logos` storage bucket exists.
5. Upload `clover-logo.png` in Admin → Restaurants beside Clover, then click Upload logo. If Clover is not yet in the vendor list, the restaurant needs to be created/approved first.
6. In Admin → Settings, confirm registration fee is `0` and save Website settings.
7. Upload the updated files to the existing GitHub repository and commit. Do not delete `supabase-config.js` or overwrite it with a different project's configuration.
8. Test the food page, restaurant login, logo upload, restaurant application, and an order in a controlled test before announcing launch.

## Image work still required
The admin photo tool already supports single and bulk image uploads directly to Supabase; this is the correct route for updates without GitHub. The ZIP does not include genuine photographs for every Clover menu item because the source menu is not a complete, reliably item-mapped photo library and I do not have access to the live Supabase catalogue to match database item IDs. Use actual Clover photos for dishes. Do not label generic stock or generated pictures as photographs of Clover's real meals.

## Important verification limits
- I syntax-checked the inline JavaScript in `foods.html`, `restaurant.html`, and `admin.html` and checked `app-core.js` syntax.
- I cannot verify Supabase RLS policies, live RPC return fields, the live vendor catalogue, or a completed payment/order from the source ZIP alone. Test these on the current Supabase project after applying the migration.
- The migration assumes the existing schema has `food_vendors.id`, `food_vendors.user_id`, `profiles.id`, `profiles.role`, and `settings(key,value)` as used by the current source. If your live schema differs, stop and adjust the migration before running it.
