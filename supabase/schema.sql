create table if not exists households (
  id uuid primary key default gen_random_uuid(),
  address text not null unique,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default auth.uid(),
  full_name text not null,
  avatar_url text,
  household_id uuid references households(id) on delete set null,
  is_board boolean default false,
  created_at timestamptz default now()
);

create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_private boolean default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists channel_members (
  channel_id uuid references channels(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  primary key (channel_id, profile_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references channels(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  description text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table households enable row level security;
alter table channels enable row level security;
alter table channel_members enable row level security;
alter table messages enable row level security;
alter table notices enable row level security;
alter table events enable row level security;

create policy "profiles_read_all" on profiles for select using (true);
create policy "profiles_update_self" on profiles for update using (auth.uid() = id);

create policy "households_read_all" on households for select using (true);

create policy "channels_read_public_or_member" on channels for select using (
  not is_private or exists (
    select 1 from channel_members cm where cm.channel_id = id and cm.profile_id = auth.uid()
  )
);
create policy "channels_insert_auth" on channels for insert with check (auth.role() = 'authenticated');

create policy "channel_members_read" on channel_members for select using (
  profile_id = auth.uid() or exists (
    select 1 from channels c where c.id = channel_members.channel_id and not c.is_private
  )
);
create policy "channel_members_insert" on channel_members for insert with check (auth.role() = 'authenticated');

create policy "messages_read" on messages for select using (
  exists (select 1 from channels c where c.id = channel_id and (not c.is_private or exists (
    select 1 from channel_members cm where cm.channel_id = c.id and cm.profile_id = auth.uid()
  )))
);
create policy "messages_insert" on messages for insert with check (
  exists (select 1 from channels c where c.id = channel_id and (
    not c.is_private or exists (
      select 1 from channel_members cm where cm.channel_id = c.id and cm.profile_id = auth.uid()
    )
  ))
);

create policy "notices_read" on notices for select using (true);
create policy "notices_insert_board" on notices for insert with check (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_board)
);

create policy "events_read" on events for select using (true);
create policy "events_insert_auth" on events for insert with check (auth.role() = 'authenticated');
create policy "events_update_own" on events for update using (created_by = auth.uid());

insert into channels (name, is_private) values ('general', false) on conflict do nothing;
