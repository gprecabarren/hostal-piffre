-- Run once (or repeatedly) in the existing project's SQL Editor before saving
-- more/fewer properties. No existing JSON, photos, links or content is changed.
-- The application normalizes legacy JSON in memory and saves the expanded shape
-- only after an authorized administrator saves it from the panel.
begin;

alter table public.site_content drop constraint if exists site_content_three_rooms;
alter table public.site_content drop constraint if exists site_content_room_count;
alter table public.site_content add constraint site_content_room_count check (
  case when jsonb_typeof(content->'rooms') = 'array' then jsonb_array_length(content->'rooms') between 1 and 30 else false end
);

commit;
