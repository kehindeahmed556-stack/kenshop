-- =============================================================
-- Kenshop — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================

-- ───────────────────────────────────────────────
-- 1. PROFILES  (extends auth.users 1-to-1)
-- ───────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  location    text,
  bio         text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now()
);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ───────────────────────────────────────────────
-- 2. LISTINGS
-- ───────────────────────────────────────────────
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  category    text,
  condition   text check (condition in ('new','like_new','used','for_parts')),
  price       numeric(12,2) not null check (price >= 0),
  currency    char(3) not null default 'USD',
  quantity    int not null default 1 check (quantity >= 0),
  status      text not null default 'active' check (status in ('active','sold','draft')),
  location    text,
  tags        text,
  shipping_address text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now()
);

create index if not exists listings_seller_id_idx  on public.listings(seller_id);
create index if not exists listings_category_idx   on public.listings(category);
create index if not exists listings_status_idx     on public.listings(status);
create index if not exists listings_created_at_idx on public.listings(created_at desc);

-- ───────────────────────────────────────────────
-- 3. LISTING IMAGES
-- ───────────────────────────────────────────────
create table if not exists public.listing_images (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  sort_order  int not null default 0,
  created_at  timestamptz default now()
);

create index if not exists listing_images_listing_id_idx on public.listing_images(listing_id);

-- ───────────────────────────────────────────────
-- 4. ORDERS
-- ───────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  buyer_id         uuid not null references public.profiles(id) on delete restrict,
  seller_id        uuid not null references public.profiles(id) on delete restrict,
  listing_id       uuid not null references public.listings(id) on delete restrict,
  quantity         int not null default 1 check (quantity > 0),
  total_price      numeric(12,2) not null,
  currency         char(3) not null default 'USD',
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  shipping_address text,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now()
);

create index if not exists orders_buyer_id_idx  on public.orders(buyer_id);
create index if not exists orders_seller_id_idx on public.orders(seller_id);

-- ───────────────────────────────────────────────
-- 5. MESSAGES
-- ───────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz default now() not null
);

create index if not exists messages_listing_id_idx  on public.messages(listing_id);
create index if not exists messages_sender_id_idx   on public.messages(sender_id);
create index if not exists messages_receiver_id_idx on public.messages(receiver_id);

-- ───────────────────────────────────────────────
-- 6. ROW-LEVEL SECURITY
-- ───────────────────────────────────────────────

-- Enable RLS
alter table public.profiles       enable row level security;
alter table public.listings        enable row level security;
alter table public.listing_images  enable row level security;
alter table public.orders          enable row level security;
alter table public.messages        enable row level security;

-- ── PROFILES ──
-- Anyone can read profiles
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ── LISTINGS ──
-- Anyone can read active listings
create policy "Active listings are public"
  on public.listings for select
  using (status = 'active' or seller_id = auth.uid());

-- Authenticated users can create listings
create policy "Authenticated users can create listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);

-- Sellers can update/delete their own listings
create policy "Sellers can update own listings"
  on public.listings for update
  using (auth.uid() = seller_id);

create policy "Sellers can delete own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);

-- ── LISTING IMAGES ──
-- Anyone can read listing images
create policy "Listing images are public"
  on public.listing_images for select using (true);

-- Only the listing seller can insert/delete images
create policy "Sellers can insert listing images"
  on public.listing_images for insert
  with check (
    auth.uid() = (select seller_id from public.listings where id = listing_id)
  );

create policy "Sellers can delete own listing images"
  on public.listing_images for delete
  using (
    auth.uid() = (select seller_id from public.listings where id = listing_id)
  );

-- ── ORDERS ──
-- Buyers and sellers can see their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- Buyers can create orders
create policy "Buyers can create orders"
  on public.orders for insert
  with check (auth.uid() = buyer_id);

-- Sellers can update order status
create policy "Sellers can update order status"
  on public.orders for update
  using (auth.uid() = seller_id);

-- ── MESSAGES ──
-- Users can read messages they sent or received
create policy "Users can read own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Authenticated users can send messages
create policy "Authenticated users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- ───────────────────────────────────────────────
-- 7. STORAGE BUCKETS
-- ───────────────────────────────────────────────
-- Run these in Supabase Dashboard → Storage, or uncomment below:
-- Note: Storage bucket policies use a different syntax in Supabase Dashboard.

-- Create buckets via API or Dashboard:
--   bucket: 'listing-images'  (public: true)
--   bucket: 'avatars'         (public: true)

-- Storage RLS policies (create in Dashboard → Storage → Policies):
-- Allow public read for both buckets
-- Allow authenticated users to upload to listing-images/avatars
-- Allow users to delete their own files

-- ───────────────────────────────────────────────
-- 8. REALTIME
-- ───────────────────────────────────────────────
-- Enable realtime for messages table:
-- Dashboard → Database → Replication → enable for: messages

-- ───────────────────────────────────────────────
-- 9. FULL TEXT SEARCH INDEX (optional but useful)
-- ───────────────────────────────────────────────
create index if not exists listings_fts_idx on public.listings
  using gin(to_tsvector('english', title || ' ' || coalesce(description, '') || ' ' || coalesce(tags, '')));
