create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id bigserial primary key,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  category text not null,
  condition text,
  status text not null default 'active'
    check (status in ('active','sold','removed')),
  created_at timestamptz not null default now()
);

create index if not exists listings_feed_idx on public.listings (status, created_at desc);
create index if not exists listings_seller_idx on public.listings (seller_id);

create table if not exists public.listing_images (
  id bigserial primary key,
  listing_id bigint not null references public.listings(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists listing_images_listing_idx on public.listing_images (listing_id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    lower(new.email),
    split_part(lower(new.email), '@', 1)
  )
  on conflict (id) do update set
    email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute procedure public.handle_new_user_profile();
