-- Run in the SQL Editor after schema.sql. All operations roll back.
begin;

do $$
begin
  if not (select relrowsecurity from pg_class where oid = 'public.site_content'::regclass) then
    raise exception 'site_content requires RLS';
  end if;
  if not exists (select 1 from public.site_content where id = 'main' and jsonb_array_length(content->'rooms') between 1 and 30) then
    raise exception 'The initial content is missing';
  end if;
  if has_table_privilege('anon', 'public.site_content', 'insert,update,delete,truncate') or
     has_table_privilege('authenticated', 'public.site_content', 'insert,update,delete,truncate') then
    raise exception 'Public roles must not hold content write grants';
  end if;
end $$;

set local role anon;
select id, jsonb_array_length(content->'rooms') as room_count from public.site_content;
reset role;
set local role authenticated;
select id, jsonb_array_length(content->'rooms') as room_count from public.site_content;
reset role;

select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'room-images';
select schemaname, tablename, policyname, permissive, roles, cmd from pg_policies
where (schemaname = 'public' and tablename = 'site_content')
or (schemaname = 'storage' and tablename = 'objects' and policyname like 'Room images%');

rollback;
