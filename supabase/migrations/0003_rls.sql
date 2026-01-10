alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;

create policy "profiles_select_authenticated"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id);

create policy "listings_select_active"
on public.listings for select
using (status = 'active');

create policy "listings_insert_own"
on public.listings for insert
to authenticated
with check (auth.uid() = seller_id);

create policy "listings_update_own"
on public.listings for update
to authenticated
using (auth.uid() = seller_id);

create policy "listing_images_select_all"
on public.listing_images for select
using (true);

create policy "listing_images_insert_own"
on public.listing_images for insert
to authenticated
with check (
  exists (
    select 1 from public.listings l
    where l.id = listing_id
      and l.seller_id = auth.uid()
  )
);

create policy "listing_images_delete_own"
on public.listing_images for delete
to authenticated
using (
  exists (
    select 1 from public.listings l
    where l.id = listing_id
      and l.seller_id = auth.uid()
  )
);
