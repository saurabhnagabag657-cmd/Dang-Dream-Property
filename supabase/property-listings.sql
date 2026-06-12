create extension if not exists pgcrypto;

create table if not exists public.user_properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null,
  price text not null,
  price_value numeric(14,2) default 0,
  property_type text not null,
  txn text not null check (txn in ('sale', 'rent', 'exchange')),
  listing_state text not null default 'draft' check (listing_state in ('draft', 'pending', 'approved', 'rejected', 'available', 'sold', 'rented')),
  approval_status text not null default 'draft' check (approval_status in ('draft', 'pending', 'approved', 'rejected')),
  full_location text not null,
  location text,
  city text,
  road text,
  facing text,
  google_maps_url text,
  bedrooms integer default 0,
  bathrooms integer default 0,
  living_rooms integer default 0,
  kitchens integer default 0,
  land_area text,
  built_up_area text,
  contact_name text not null,
  contact_phone text not null,
  contact_email text,
  amenities jsonb not null default '[]'::jsonb,
  image_urls jsonb not null default '[]'::jsonb,
  image_paths jsonb not null default '[]'::jsonb,
  cover_image_url text,
  cover_image_path text,
  featured boolean not null default false,
  views_count integer not null default 0,
  inquiries_count integer not null default 0,
  admin_notes text,
  rejected_reason text,
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_properties_owner_id_idx on public.user_properties (owner_id);
create index if not exists user_properties_approval_status_idx on public.user_properties (approval_status);
create index if not exists user_properties_listing_state_idx on public.user_properties (listing_state);
create index if not exists user_properties_featured_idx on public.user_properties (featured);

create table if not exists public.property_inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.user_properties(id) on delete cascade,
  property_owner_id uuid not null references auth.users(id) on delete cascade,
  property_title text not null,
  sender_name text not null,
  sender_phone text not null,
  sender_email text,
  role text not null default 'Buyer',
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists property_inquiries_property_id_idx on public.property_inquiries (property_id);
create index if not exists property_inquiries_owner_id_idx on public.property_inquiries (property_owner_id);

create table if not exists public.property_views (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.user_properties(id) on delete cascade,
  viewer_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists property_views_property_id_idx on public.property_views (property_id);

create or replace function public.is_admin_user(p_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(p_user_id, auth.uid())
      and lower(coalesce(status, '')) = 'admin'
  );
$$;

create or replace function public.make_property_slug(p_title text, p_owner_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  candidate text;
begin
  base_slug := regexp_replace(lower(trim(coalesce(p_title, 'property'))), '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-|-$)', '', 'g');
  if base_slug = '' then
    base_slug := 'property';
  end if;
  candidate := base_slug || '-' || substr(replace(p_owner_id::text, '-', ''), 1, 6);
  return candidate;
end;
$$;

create or replace function public.set_property_timestamps()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.slug is null or trim(new.slug) = '' then
      new.slug := public.make_property_slug(new.title, new.owner_id);
    end if;

    if new.approval_status = 'approved' then
      new.approved_at := coalesce(new.approved_at, now());
      new.published_at := coalesce(new.published_at, now());
      new.listing_state := coalesce(new.listing_state, 'available');
    elsif new.approval_status = 'pending' then
      new.submitted_at := coalesce(new.submitted_at, now());
    end if;
  end if;

  if tg_op = 'UPDATE' then
    if new.slug is null or trim(new.slug) = '' then
      new.slug := public.make_property_slug(new.title, new.owner_id);
    end if;

    if new.approval_status = 'approved' and old.approval_status is distinct from 'approved' then
      new.approved_at := coalesce(new.approved_at, now());
      new.published_at := coalesce(new.published_at, now());
      new.listing_state := coalesce(new.listing_state, 'available');
    end if;

    if new.approval_status = 'pending' and old.approval_status is distinct from 'pending' then
      new.submitted_at := now();
      new.rejected_reason := null;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_property_timestamps on public.user_properties;
create trigger trg_set_property_timestamps
before insert or update on public.user_properties
for each row execute function public.set_property_timestamps();

create or replace function public.log_property_view(p_property_id uuid, p_viewer_id uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.property_views(property_id, viewer_id)
  values (p_property_id, p_viewer_id);

  update public.user_properties
  set views_count = coalesce(views_count, 0) + 1
  where id = p_property_id;
end;
$$;

create or replace function public.submit_property_inquiry(
  p_property_id uuid,
  p_property_title text,
  p_sender_name text,
  p_sender_phone text,
  p_sender_email text default null,
  p_role text default 'Buyer',
  p_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_inquiry_id uuid;
begin
  select owner_id into v_owner_id
  from public.user_properties
  where id = p_property_id;

  if v_owner_id is null then
    raise exception 'Property not found';
  end if;

  insert into public.property_inquiries (
    property_id,
    property_owner_id,
    property_title,
    sender_name,
    sender_phone,
    sender_email,
    role,
    message
  ) values (
    p_property_id,
    v_owner_id,
    coalesce(nullif(trim(p_property_title), ''), 'Property'),
    p_sender_name,
    p_sender_phone,
    nullif(trim(p_sender_email), ''),
    coalesce(nullif(trim(p_role), ''), 'Buyer'),
    coalesce(nullif(trim(p_message), ''), '')
  ) returning id into v_inquiry_id;

  update public.user_properties
  set inquiries_count = coalesce(inquiries_count, 0) + 1
  where id = p_property_id;

  return v_inquiry_id;
end;
$$;

alter table public.user_properties enable row level security;
alter table public.property_inquiries enable row level security;
alter table public.property_views enable row level security;

drop policy if exists "Public can read approved listings" on public.user_properties;
create policy "Public can read approved listings"
on public.user_properties
for select
to public
using (approval_status = 'approved' or owner_id = auth.uid() or public.is_admin_user());

drop policy if exists "Owners can insert listings" on public.user_properties;
create policy "Owners can insert listings"
on public.user_properties
for insert
to authenticated
with check (owner_id = auth.uid() or public.is_admin_user());

drop policy if exists "Owners and admins can update listings" on public.user_properties;
create policy "Owners and admins can update listings"
on public.user_properties
for update
to authenticated
using (owner_id = auth.uid() or public.is_admin_user())
with check (owner_id = auth.uid() or public.is_admin_user());

drop policy if exists "Owners and admins can delete listings" on public.user_properties;
create policy "Owners and admins can delete listings"
on public.user_properties
for delete
to authenticated
using (owner_id = auth.uid() or public.is_admin_user());

drop policy if exists "Public can insert inquiries" on public.property_inquiries;
create policy "Public can insert inquiries"
on public.property_inquiries
for insert
to public
with check (true);

drop policy if exists "Owners and admins can read inquiries" on public.property_inquiries;
create policy "Owners and admins can read inquiries"
on public.property_inquiries
for select
to authenticated
using (
  property_owner_id = auth.uid()
  or public.is_admin_user()
);

drop policy if exists "Owners and admins can read views" on public.property_views;
create policy "Owners and admins can read views"
on public.property_views
for select
to authenticated
using (
  exists (
    select 1
    from public.user_properties p
    where p.id = property_id
      and (p.owner_id = auth.uid() or public.is_admin_user())
  )
);

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload property images" on storage.objects;
create policy "Authenticated users can upload property images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Authenticated users can update property images" on storage.objects;
create policy "Authenticated users can update property images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Authenticated users can delete property images" on storage.objects;
create policy "Authenticated users can delete property images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
