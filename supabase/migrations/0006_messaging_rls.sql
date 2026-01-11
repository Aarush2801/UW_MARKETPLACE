alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "conversations_select_members"
on public.conversations
for select
to authenticated
using (
  auth.uid() = buyer_id or auth.uid() = seller_id
);

create policy "conversations_insert_buyer_only"
on public.conversations
for insert
to authenticated
with check (
  auth.uid() = buyer_id
  and buyer_id <> seller_id
  and exists (
    select 1
    from public.listings l
    where l.id = listing_id
      and l.seller_id = seller_id
      and l.status = 'active'
  )
);

create policy "messages_select_members"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (auth.uid() = c.buyer_id or auth.uid() = c.seller_id)
  )
);

create policy "messages_insert_members"
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (auth.uid() = c.buyer_id or auth.uid() = c.seller_id)
  )
);
