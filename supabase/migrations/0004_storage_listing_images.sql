insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "public read listing-images" on storage.objects;
create policy "public read listing-images"
on storage.objects for select
using (bucket_id = 'listing-images');

drop policy if exists "upload own listing-images" on storage.objects;
create policy "upload own listing-images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "delete own listing-images" on storage.objects;
create policy "delete own listing-images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
