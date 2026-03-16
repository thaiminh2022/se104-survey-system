alter table public.surveys enable row level security;

create policy "public can read published surveys"
on public.surveys
for select
to anon, authenticated
using (state = 'published');

create policy "owners can read their own surveys"
on public.surveys
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "authenticated users can create surveys for themselves"
on public.surveys
for insert
to authenticated
with check ((select auth.uid())  = user_id);

create policy "owners can update their own surveys"
on public.surveys
for update
to authenticated
using ((select auth.uid())  = user_id)
with check ((select auth.uid())  = user_id);

create policy "owners can delete their own surveys"
on public.surveys
for delete
to authenticated
using ((select auth.uid())  = user_id);