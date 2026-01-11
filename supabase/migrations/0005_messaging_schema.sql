create table if not exists public.conversations (
  id bigserial primary key,
  listing_id bigint not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz
);

create unique index if not exists conversations_unique_listing_buyer
on public.conversations (listing_id, buyer_id);

create index if not exists conversations_seller_idx 
on public.conversations (seller_id, last_message_at desc);

create index if not exists conversations_buyer_idx 
on public.conversations (buyer_id, last_message_at desc);

create table if not exists public.messages (
  id bigserial primary key,
  conversation_id bigint not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_conv_idx 
on public.messages (conversation_id, created_at asc);

create or replace function public.touch_conversation_last_message()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists trg_touch_conversation_last_message on public.messages;

create trigger trg_touch_conversation_last_message
after insert on public.messages
for each row
execute procedure public.touch_conversation_last_message();
