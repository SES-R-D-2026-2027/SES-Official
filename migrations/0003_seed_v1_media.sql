-- SES Version 2: media metadata for the Version 1 assets moved to R2.
-- Apply this migration only after scripts/upload-r2-media.mjs has uploaded the manifest.

INSERT INTO media_assets (id, object_key, original_file_name, mime_type, size_bytes, alt_text, is_public, metadata_json)
VALUES
  ('media-99df9675f7348378368d25fe', 'v1/brand/ses-ball-mark.png', 'ses-ball-mark.png', 'image/png', 52163, 'ses ball mark', 1, '{}'),
  ('media-b192a2fa9bb2a32e78819edc', 'v1/brand/ses-logo-dark.png', 'ses-logo-dark.png', 'image/png', 342864, 'ses logo dark', 1, '{}'),
  ('media-f17cec40e784ac9865780f22', 'v1/brand/ses-logo-light.png', 'ses-logo-light.png', 'image/png', 353221, 'ses logo light', 1, '{}'),
  ('media-e8d3e2f7d439503fe9108929', 'v1/images/IMG-20251129-WA0065.jpg', 'IMG-20251129-WA0065.jpg', 'image/jpeg', 213678, 'IMG 20251129 WA0065', 1, '{}'),
  ('media-c9acfc140e889309d9268bdd', 'v1/images/IMG-20251129-WA0186.jpg', 'IMG-20251129-WA0186.jpg', 'image/jpeg', 115148, 'IMG 20251129 WA0186', 1, '{}'),
  ('media-9b03b48415048c7d3c8a0772', 'v1/images/IMG-20251129-WA0244.jpg', 'IMG-20251129-WA0244.jpg', 'image/jpeg', 144505, 'IMG 20251129 WA0244', 1, '{}'),
  ('media-99f336680997ff9407246446', 'v1/images/IMG_5931.JPG', 'IMG_5931.JPG', 'image/jpeg', 366514, 'IMG 5931', 1, '{}'),
  ('media-40d9281ca92a08dd2502217c', 'v1/images/events/arbisoft/Arbisoft_speaker_session.JPG', 'Arbisoft_speaker_session.JPG', 'image/jpeg', 244737, 'Arbisoft speaker session', 1, '{}'),
  ('media-350478466903df06ddede082', 'v1/images/events/arbisoft/arbisoft_SES_collab.JPG', 'arbisoft_SES_collab.JPG', 'image/jpeg', 257787, 'arbisoft SES collab', 1, '{}'),
  ('media-fd9bf07a8a3c1119fe65d85b', 'v1/images/events/arbisoft/arbisoft_session.JPG', 'arbisoft_session.JPG', 'image/jpeg', 282923, 'arbisoft session', 1, '{}'),
  ('media-cda2c90d07ab6da91e3299ec', 'v1/images/events/canva-workshop/audience.jpg', 'audience.jpg', 'image/jpeg', 394319, 'audience', 1, '{}'),
  ('media-4fb3f56d76b571dca0289c73', 'v1/images/events/canva-workshop/cover.jpg', 'cover.jpg', 'image/jpeg', 323503, 'cover', 1, '{}'),
  ('media-c946cc038608033879aa1263', 'v1/images/events/canva-workshop/speaker.jpg', 'speaker.jpg', 'image/jpeg', 248253, 'speaker', 1, '{}'),
  ('media-787108b4bfe0c944726cca77', 'v1/images/events/orientation/Orientation_2025(1).JPG', 'Orientation_2025(1).JPG', 'image/jpeg', 241389, 'Orientation 2025(1)', 1, '{}'),
  ('media-360d1ac593d666e8412bcf92', 'v1/images/events/orientation/Orientation_2025(2).JPG', 'Orientation_2025(2).JPG', 'image/jpeg', 382289, 'Orientation 2025(2)', 1, '{}'),
  ('media-8bdbdacbd761da5eca1ad579', 'v1/images/events/orientation/Orientation_2025.JPG', 'Orientation_2025.JPG', 'image/jpeg', 455829, 'Orientation 2025', 1, '{}'),
  ('media-ff28ac6ed614254df6948aa5', 'v1/images/events/orientation/orientation_25batch.jpg', 'orientation_25batch.jpg', 'image/jpeg', 274960, 'orientation 25batch', 1, '{}'),
  ('media-a4b7049dd1e6bf1a3c7d1fb7', 'v1/images/events/soventure/Soventure_Banners.jpg', 'Soventure_Banners.jpg', 'image/jpeg', 231156, 'Soventure Banners', 1, '{}'),
  ('media-65542c4106391338db24264c', 'v1/images/events/soventure/Soventure_Cursor_Session.png', 'Soventure_Cursor_Session.png', 'image/png', 1906527, 'Soventure Cursor Session', 1, '{}'),
  ('media-922a246c2011dc3d1f63b2f4', 'v1/images/events/soventure/Soventure_chess_tournament.JPG', 'Soventure_chess_tournament.JPG', 'image/jpeg', 269121, 'Soventure chess tournament', 1, '{}'),
  ('media-27b66bc6fc61952a2259ab6c', 'v1/images/events/soventure/Soventure_pf_workshop.jpg', 'Soventure_pf_workshop.jpg', 'image/jpeg', 159709, 'Soventure pf workshop', 1, '{}'),
  ('media-1961fe97b669288ad57dc922', 'v1/images/events/soventure/soventure_bonfire.jpg', 'soventure_bonfire.jpg', 'image/jpeg', 330610, 'soventure bonfire', 1, '{}'),
  ('media-ff3b51bb9de1e8a673d4d0d1', 'v1/images/events/soventure/soventure_stalls.jpg', 'soventure_stalls.jpg', 'image/jpeg', 96204, 'soventure stalls', 1, '{}'),
  ('media-7a938ae2661f68a4c78470a1', 'v1/images/team/Advisor_SES_ArsalTemuri.jpg', 'Advisor_SES_ArsalTemuri.jpg', 'image/jpeg', 121070, 'Advisor SES ArsalTemuri', 1, '{}'),
  ('media-fa11885b15524683216a4947', 'v1/images/team/Colead_Operations_Mohsin-Khan.jpg', 'Colead_Operations_Mohsin-Khan.jpg', 'image/jpeg', 165142, 'Colead Operations Mohsin Khan', 1, '{}'),
  ('media-5dcb2ddede04ced0b7a8c945', 'v1/images/team/Colead_media&graphics_Muhammad_Faiq_Haider.jpg', 'Colead_media&graphics_Muhammad_Faiq_Haider.jpg', 'image/jpeg', 258073, 'Colead media&graphics Muhammad Faiq Haider', 1, '{}'),
  ('media-b7f1f4005355fb4d117011d2', 'v1/images/team/Lead_Events_Usman.jpg', 'Lead_Events_Usman.jpg', 'image/jpeg', 296855, 'Lead Events Usman', 1, '{}'),
  ('media-84d5a9c5273205f3c0fcf806', 'v1/images/team/Lead_Info&Coord_AsharAhmed.jpg', 'Lead_Info&Coord_AsharAhmed.jpg', 'image/jpeg', 237320, 'Lead Info&Coord AsharAhmed', 1, '{}'),
  ('media-ab877ee5bbe7f62995cced37', 'v1/images/team/Lead_Logistics_&_Decor_Saliha_Noor.jpg', 'Lead_Logistics_&_Decor_Saliha_Noor.jpg', 'image/jpeg', 449836, 'Lead Logistics & Decor Saliha Noor', 1, '{}'),
  ('media-d9fc55184f6154c9648d997d', 'v1/images/team/Lead_Security_SanaIdrees.jpg', 'Lead_Security_SanaIdrees.jpg', 'image/jpeg', 319214, 'Lead Security SanaIdrees', 1, '{}'),
  ('media-2157f0d69d30f3651403a712', 'v1/images/team/President_SES_Maryam.jpg', 'President_SES_Maryam.jpg', 'image/jpeg', 222033, 'President SES Maryam', 1, '{}'),
  ('media-00a04107a561e7a7c7937556', 'v1/images/team/VPExternals_SES_Salman.jpg', 'VPExternals_SES_Salman.jpg', 'image/jpeg', 44512, 'VPExternals SES Salman', 1, '{}'),
  ('media-a666426d7968873928490a3a', 'v1/images/team/VPinternal_SES_Fizza.jpg', 'VPinternal_SES_Fizza.jpg', 'image/jpeg', 371563, 'VPinternal SES Fizza', 1, '{}'),
  ('media-aa1b12db3ec8cf02fd7bdc8a', 'v1/images/team/colead-research-development-muhammad-sanaullah.jpg', 'colead-research-development-muhammad-sanaullah.jpg', 'image/jpeg', 198947, 'colead research development muhammad sanaullah', 1, '{}'),
  ('media-187a2807bdf9c744627ad5bd', 'v1/images/team/lead-research-development-ermish-tabassum.jpg', 'lead-research-development-ermish-tabassum.jpg', 'image/jpeg', 302431, 'lead research development ermish tabassum', 1, '{}'),
  ('media-5de08eae4396db75ecbefbed', 'v1/images/team/lead_Media&Graphics_AbihaJibbran.jpg', 'lead_Media&Graphics_AbihaJibbran.jpg', 'image/jpeg', 546608, 'lead Media&Graphics AbihaJibbran', 1, '{}'),
  ('media-0777bb372cb4c0c801b30314', 'v1/images/team/lead_marketing_ishmalnajeeb.png', 'lead_marketing_ishmalnajeeb.png', 'image/png', 1179369, 'lead marketing ishmalnajeeb', 1, '{}')
ON CONFLICT(object_key) DO UPDATE SET
  original_file_name = excluded.original_file_name,
  mime_type = excluded.mime_type,
  size_bytes = excluded.size_bytes,
  alt_text = excluded.alt_text,
  is_public = excluded.is_public,
  metadata_json = excluded.metadata_json,
  updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');

-- Idempotent seed: reruns update metadata without double-counting storage bytes.
-- The migration system applies this file once per database; the UPSERT also protects manual reruns.
-- The media_assets size-update trigger keeps media_storage_state.used_bytes accurate.
