-- Enforce @uwaterloo.ca emails at the Auth DB layer.
-- Blocks sign-ups and email changes that don't match the allowed domain.

create or replace function public.enforce_uw_email_domain()
returns trigger
language plpgsql
security definer
as $$
declare
  email text;
begin
  email := lower(coalesce(new.email, ''));

  if email = '' then
    raise exception 'Email is required';
  end if;

  if right(email, length('@uwaterloo.ca')) <> '@uwaterloo.ca' then
    raise exception 'Only @uwaterloo.ca accounts are allowed';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_uw_email_domain_insert on auth.users;
create trigger trg_enforce_uw_email_domain_insert
before insert on auth.users
for each row
execute procedure public.enforce_uw_email_domain();

drop trigger if exists trg_enforce_uw_email_domain_update on auth.users;
create trigger trg_enforce_uw_email_domain_update
before update of email on auth.users
for each row
execute procedure public.enforce_uw_email_domain();
