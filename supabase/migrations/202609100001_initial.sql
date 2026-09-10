-- Quasar: normalized public curriculum; private per-user learning state.
create table public.subjects(id text primary key,name text not null,region text default 'US',locale text default 'en',is_available boolean not null default false);
create table public.characters(id text primary key,name text not null,description text not null,reference_image_url text);
create table public.scenes(id text primary key,subject_id text references public.subjects(id) not null,title text not null,background_image_url text,style text not null default 'storybook');
create table public.facts(id text primary key,topic_id text not null,fact_text text not null,order_index integer not null);
create table public.mnemonics(id text primary key,fact_id text references public.facts(id) not null,technique_type text not null,style text not null,image_url text,story_text text not null,is_public boolean not null default true,created_at timestamptz not null default now());
create table public.scene_hotspots(id text primary key,scene_id text references public.scenes(id) not null,x_position numeric check(x_position between 0 and 100),y_position numeric check(y_position between 0 and 100),fact_id text references public.facts(id),mnemonic_id text references public.mnemonics(id),label text not null);
-- Mastery belongs to a learner, never to a shared hotspot.
create table public.hotspot_progress(user_id uuid references auth.users on delete cascade,hotspot_id text references public.scene_hotspots on delete cascade,mastered boolean default false,primary key(user_id,hotspot_id));
create table public.technique_lessons(id integer primary key,title text not null,technique_type text not null,explanation_text text not null,order_index integer not null);
create table public.personalization_profiles(user_id uuid primary key references auth.users on delete cascade,interests jsonb not null default '{}',preferred_style text not null default 'storybook');
create table public.learning_states(user_id uuid primary key references auth.users on delete cascade,state jsonb not null check(jsonb_typeof(state)='object'),updated_at timestamptz not null default now());
create table public.review_logs(id text primary key,user_id uuid not null references auth.users on delete cascade,mnemonic_id text not null references public.mnemonics(id),recalled_correctly boolean not null,reviewed_at timestamptz not null,next_review_at timestamptz not null,fsrs_stability double precision not null,fsrs_difficulty double precision not null);
create index review_logs_user_due on public.review_logs(user_id,next_review_at);
create table public.generation_usage(user_id uuid references auth.users on delete cascade,day date default current_date,count integer default 0,primary key(user_id,day));
create table public.generated_mnemonics(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,fact_id text references public.facts(id),story text not null,image_path text,style text not null,created_at timestamptz default now());
do $$ declare t text; begin
 foreach t in array array['subjects','characters','scenes','facts','mnemonics','scene_hotspots','technique_lessons'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy curriculum_read on public.%I for select to anon, authenticated using (true)',t);
 execute format('grant select on public.%I to anon, authenticated',t);
 end loop;
 foreach t in array array['hotspot_progress','personalization_profiles','learning_states','review_logs'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy own_rows on public.%I for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id)',t);
 execute format('grant select,insert,update,delete on public.%I to authenticated',t);
 end loop;
end $$;
alter table public.generation_usage enable row level security;
alter table public.generated_mnemonics enable row level security;
create policy own_generated on public.generated_mnemonics for select to authenticated using((select auth.uid())=user_id);
grant select on public.generated_mnemonics to authenticated;
-- Atomic quota; service-role only. Failed upstream attempts also consume quota to limit abuse.
create function public.consume_generation_quota(uid uuid) returns boolean language plpgsql security definer set search_path=public as $$
declare n integer; begin
 insert into generation_usage(user_id,day,count) values(uid,current_date,1)
 on conflict(user_id,day) do update set count=generation_usage.count+1 where generation_usage.count<10 returning count into n;
 return n is not null;
end $$;
revoke all on function public.consume_generation_quota(uuid) from public,anon,authenticated;
grant execute on function public.consume_generation_quota(uuid) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('mnemonics','mnemonics',false,10485760,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy own_images on storage.objects for select to authenticated using(bucket_id='mnemonics' and (storage.foldername(name))[1]=(select auth.uid())::text);
