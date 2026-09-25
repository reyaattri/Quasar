-- AI gateway: per-feature daily quotas and a request log (task, model, tokens) for cost monitoring.
create table public.ai_usage(
  user_id uuid not null references auth.users on delete cascade,
  day date not null default current_date,
  task text not null,
  count integer not null default 0,
  primary key(user_id, day, task)
);
create table public.ai_requests(
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  task text not null,
  model text,
  status text not null,
  input_tokens integer,
  output_tokens integer,
  created_at timestamptz not null default now()
);
create index ai_requests_user_time on public.ai_requests(user_id, created_at desc);
alter table public.ai_usage enable row level security;
alter table public.ai_requests enable row level security;
create policy own_ai_usage on public.ai_usage for select to authenticated using ((select auth.uid()) = user_id);
create policy own_ai_requests on public.ai_requests for select to authenticated using ((select auth.uid()) = user_id);
grant select on public.ai_usage, public.ai_requests to authenticated;

-- Atomic per-task quota; service-role only. Keep the limits in sync with DAILY_LIMITS in _shared/tasks.ts.
create function public.consume_ai_quota(p_uid uuid, p_task text) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  lim integer := case p_task when 'tutor' then 30 when 'quiz' then 5 when 'story' then 10 when 'hook' then 15 else 0 end;
  n integer;
begin
  if lim = 0 then return false; end if;
  insert into ai_usage(user_id, day, task, count) values (p_uid, current_date, p_task, 1)
  on conflict (user_id, day, task) do update set count = ai_usage.count + 1 where ai_usage.count < lim
  returning count into n;
  return n is not null;
end $$;
revoke all on function public.consume_ai_quota(uuid, text) from public, anon, authenticated;
grant execute on function public.consume_ai_quota(uuid, text) to service_role;
