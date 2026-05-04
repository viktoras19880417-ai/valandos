alter table public.profiles enable row level security;
alter table public.work_entries enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.list_profiles_for_admin()
returns table (
  id uuid,
  full_name text,
  email text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    profiles.id,
    profiles.full_name,
    profiles.email,
    profiles.role,
    profiles.created_at,
    profiles.updated_at
  from public.profiles
  where public.is_admin()
  order by profiles.full_name asc nulls last, profiles.email asc nulls last;
$$;

revoke all on function public.list_profiles_for_admin() from public;
grant execute on function public.list_profiles_for_admin() to authenticated;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;

create policy "profiles_select_own"
on public.profiles
for select
using (
  auth.uid() = id
);

drop policy if exists "employees_insert_own_entries_or_admin" on public.work_entries;
drop policy if exists "employees_read_own_entries_or_admin" on public.work_entries;
drop policy if exists "employees_update_own_entries_or_admin" on public.work_entries;
drop policy if exists "employees_delete_own_entries_or_admin" on public.work_entries;

create policy "employees_insert_own_entries_or_admin"
on public.work_entries
for insert
with check (
  auth.uid() = user_id
  or public.is_admin()
);

create policy "employees_read_own_entries_or_admin"
on public.work_entries
for select
using (
  auth.uid() = user_id
  or public.is_admin()
);

create policy "employees_update_own_entries_or_admin"
on public.work_entries
for update
using (
  auth.uid() = user_id
  or public.is_admin()
)
with check (
  auth.uid() = user_id
  or public.is_admin()
);

create policy "employees_delete_own_entries_or_admin"
on public.work_entries
for delete
using (
  auth.uid() = user_id
  or public.is_admin()
);
