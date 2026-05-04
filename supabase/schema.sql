create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'employee' check (role in ('employee', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.work_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  employee_name text not null,
  employee_email text not null,
  date date not null,
  year integer not null,
  week_number integer not null check (week_number between 1 and 53),
  object_number text not null,
  object_name text not null,
  customer_name text not null,
  work_description text not null,
  hours numeric(6,2) not null check (hours >= 0 and hours <= 24),
  parking_cost numeric(10,2) not null default 0 check (parking_cost >= 0),
  travel_cost numeric(10,2) not null default 0 check (travel_cost >= 0),
  city_entry_fee numeric(10,2) not null default 0 check (city_entry_fee >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists work_entries_user_id_idx on public.work_entries (user_id);
create index if not exists work_entries_week_year_idx on public.work_entries (year, week_number);
create index if not exists work_entries_object_number_idx on public.work_entries (object_number);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists set_work_entries_updated_at on public.work_entries;
create trigger set_work_entries_updated_at
before update on public.work_entries
for each row
execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    'employee'
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

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
create policy "employees_insert_own_entries_or_admin"
on public.work_entries
for insert
with check (
  auth.uid() = user_id
  or public.is_admin()
);

drop policy if exists "employees_read_own_entries_or_admin" on public.work_entries;
create policy "employees_read_own_entries_or_admin"
on public.work_entries
for select
using (
  auth.uid() = user_id
  or public.is_admin()
);

drop policy if exists "employees_update_own_entries_or_admin" on public.work_entries;
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

drop policy if exists "employees_delete_own_entries_or_admin" on public.work_entries;
create policy "employees_delete_own_entries_or_admin"
on public.work_entries
for delete
using (
  auth.uid() = user_id
  or public.is_admin()
);
