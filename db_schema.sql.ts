
export const dbSchemaSQL = `
-- Create Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  gender text,
  phone text,
  is_phone_verified boolean default false,
  workplace text,
  role text check (role in ('rider', 'driver')),
  balance decimal default 0,
  commute_credits decimal default 0,
  home text,
  work_loc text, -- 'work' is a reserved keyword in some contexts, safer to use work_loc
  start_time text,
  end_time text,
  bio text,
  emergency_contact jsonb,
  car jsonb
);

-- Create Rides table
create table public.rides (
  id uuid default gen_random_uuid() primary key,
  driver_id uuid references public.profiles(id),
  driver_name text,
  driver_gender text,
  driver_rating decimal,
  driver_img text,
  car text,
  vehicle_type text,
  route text,
  time text,
  cost decimal,
  seats_total int,
  seats_left int,
  circle_type text,
  circle_name text,
  is_women_only boolean default false,
  start_lat decimal,
  start_lng decimal,
  end_lat decimal,
  end_lng decimal,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Trips table (bookings)
create table public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id), -- The person who booked or the driver
  ride_id uuid references public.rides(id),
  partner_name text,
  partner_img text,
  route text,
  time text,
  cost decimal,
  status text, -- 'confirmed', 'arriving', 'at-pickup', 'in-transit', 'completed'
  role text, -- 'rider' or 'driver'
  vehicle_type text,
  vehicle_info text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Requests table
create table public.requests (
  id uuid default gen_random_uuid() primary key,
  rider_id uuid references public.profiles(id),
  rider_name text,
  rider_img text,
  route text,
  time text,
  distance text,
  status text, -- 'pending', 'accepted'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies (Basic for demonstration - public access)
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

alter table public.rides enable row level security;
create policy "Rides are viewable by everyone" on public.rides for select using (true);
create policy "Drivers can insert rides" on public.rides for insert with check (auth.uid() = driver_id);
create policy "Drivers can update own rides" on public.rides for update using (auth.uid() = driver_id);

alter table public.trips enable row level security;
create policy "Users can view own trips" on public.trips for select using (auth.uid() = user_id);
create policy "Users can insert trips" on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update own trips" on public.trips for update using (auth.uid() = user_id);

alter table public.requests enable row level security;
create policy "Requests viewable by everyone" on public.requests for select using (true);
create policy "Riders can insert requests" on public.requests for insert with check (auth.uid() = rider_id);
create policy "Users can update requests" on public.requests for update using (true); 
`;
