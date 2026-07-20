import * as migration_20260702_082942_initial from './20260702_082942_initial';
import * as migration_20260703_102200_frontend_theme from './20260703_102200_frontend_theme';
import * as migration_20260703_132700_frontend_theme_cms from './20260703_132700_frontend_theme_cms';
import * as migration_20260706_112800_site_record_settings from './20260706_112800_site_record_settings';
import * as migration_20260706_114900_link_groups from './20260706_114900_link_groups';
import * as migration_20260706_133157 from './20260706_133157';
import * as migration_20260706_143634_short_links from './20260706_143634_short_links';
import * as migration_20260707_155700_novel_settings from './20260707_155700_novel_settings';
import * as migration_20260707_161100_novels_system_rels from './20260707_161100_novels_system_rels';
import * as migration_20260708_031500_media_s3_prefix from './20260708_031500_media_s3_prefix';
import * as migration_20260708_092200_content_embeddings from './20260708_092200_content_embeddings';
import * as migration_20260708_175300_content_embeddings_1024 from './20260708_175300_content_embeddings_1024';
import * as migration_20260709_022335_pages_blocks_related_faq from './20260709_022335_pages_blocks_related_faq';
import * as migration_20260710_100600_mcp_globals_tools from './20260710_100600_mcp_globals_tools';
import * as migration_20260712_144151_novel_chapters_split from './20260712_144151_novel_chapters_split';
import * as migration_20260712_145400_novel_taxonomy from './20260712_145400_novel_taxonomy';
import * as migration_20260712_150000_novel_taxonomy_versions from './20260712_150000_novel_taxonomy_versions';
import * as migration_20260712_151000_redirects_novel_chapters from './20260712_151000_redirects_novel_chapters';
import * as migration_20260712_152000_novel_chapters_version_backfill from './20260712_152000_novel_chapters_version_backfill';
import * as migration_20260712_153000_collection_versions_completeness from './20260712_153000_collection_versions_completeness';
import * as migration_20260712_154000_mcp_describe_resource from './20260712_154000_mcp_describe_resource';
import * as migration_20260713_110500_site_novel_home_toggle from './20260713_110500_site_novel_home_toggle';
import * as migration_20260717_141000_config_center_p0 from './20260717_141000_config_center_p0';
import * as migration_20260717_142000_locked_docs_llm_prompt_rels from './20260717_142000_locked_docs_llm_prompt_rels';
import * as migration_20260717_150000_config_center_p1 from './20260717_150000_config_center_p1';
import * as migration_20260717_160000_config_center_p2 from './20260717_160000_config_center_p2';
import * as migration_20260717_170000_ai_canvases from './20260717_170000_ai_canvases';
import * as migration_20260717_180000_ai_settings_embedding from './20260717_180000_ai_settings_embedding';
import * as migration_20260717_190000_drop_ai_legacy_env from './20260717_190000_drop_ai_legacy_env';
import * as migration_20260717_191000_drop_orphan_ai_settings_enums from './20260717_191000_drop_orphan_ai_settings_enums';
import * as migration_20260718_140000_galleries from './20260718_140000_galleries';
import * as migration_20260718_143000_galleries_bulk_images from './20260718_143000_galleries_bulk_images';
import * as migration_20260718_150000_search_v_rels_galleries from './20260718_150000_search_v_rels_galleries';
import * as migration_20260719_100000_users_avatar from './20260719_100000_users_avatar';
import * as migration_20260720_100000_authz_roles from './20260720_100000_authz_roles';

export const migrations = [
  {
    up: migration_20260702_082942_initial.up,
    down: migration_20260702_082942_initial.down,
    name: '20260702_082942_initial',
  },
  {
    up: migration_20260703_102200_frontend_theme.up,
    down: migration_20260703_102200_frontend_theme.down,
    name: '20260703_102200_frontend_theme',
  },
  {
    up: migration_20260703_132700_frontend_theme_cms.up,
    down: migration_20260703_132700_frontend_theme_cms.down,
    name: '20260703_132700_frontend_theme_cms',
  },
  {
    up: migration_20260706_112800_site_record_settings.up,
    down: migration_20260706_112800_site_record_settings.down,
    name: '20260706_112800_site_record_settings',
  },
  {
    up: migration_20260706_114900_link_groups.up,
    down: migration_20260706_114900_link_groups.down,
    name: '20260706_114900_link_groups',
  },
  {
    up: migration_20260706_133157.up,
    down: migration_20260706_133157.down,
    name: '20260706_133157',
  },
  {
    up: migration_20260706_143634_short_links.up,
    down: migration_20260706_143634_short_links.down,
    name: '20260706_143634_short_links',
  },
  {
    up: migration_20260707_155700_novel_settings.up,
    down: migration_20260707_155700_novel_settings.down,
    name: '20260707_155700_novel_settings',
  },
  {
    up: migration_20260707_161100_novels_system_rels.up,
    down: migration_20260707_161100_novels_system_rels.down,
    name: '20260707_161100_novels_system_rels',
  },
  {
    up: migration_20260708_031500_media_s3_prefix.up,
    down: migration_20260708_031500_media_s3_prefix.down,
    name: '20260708_031500_media_s3_prefix',
  },
  {
    up: migration_20260708_092200_content_embeddings.up,
    down: migration_20260708_092200_content_embeddings.down,
    name: '20260708_092200_content_embeddings',
  },
  {
    up: migration_20260708_175300_content_embeddings_1024.up,
    down: migration_20260708_175300_content_embeddings_1024.down,
    name: '20260708_175300_content_embeddings_1024',
  },
  {
    up: migration_20260709_022335_pages_blocks_related_faq.up,
    down: migration_20260709_022335_pages_blocks_related_faq.down,
    name: '20260709_022335_pages_blocks_related_faq',
  },
  {
    up: migration_20260710_100600_mcp_globals_tools.up,
    down: migration_20260710_100600_mcp_globals_tools.down,
    name: '20260710_100600_mcp_globals_tools',
  },
  {
    up: migration_20260712_144151_novel_chapters_split.up,
    down: migration_20260712_144151_novel_chapters_split.down,
    name: '20260712_144151_novel_chapters_split'
  },
  {
    up: migration_20260712_145400_novel_taxonomy.up,
    down: migration_20260712_145400_novel_taxonomy.down,
    name: '20260712_145400_novel_taxonomy',
  },
  {
    up: migration_20260712_150000_novel_taxonomy_versions.up,
    down: migration_20260712_150000_novel_taxonomy_versions.down,
    name: '20260712_150000_novel_taxonomy_versions',
  },
  {
    up: migration_20260712_151000_redirects_novel_chapters.up,
    down: migration_20260712_151000_redirects_novel_chapters.down,
    name: '20260712_151000_redirects_novel_chapters',
  },
  {
    up: migration_20260712_152000_novel_chapters_version_backfill.up,
    down: migration_20260712_152000_novel_chapters_version_backfill.down,
    name: '20260712_152000_novel_chapters_version_backfill',
  },
  {
    up: migration_20260712_153000_collection_versions_completeness.up,
    down: migration_20260712_153000_collection_versions_completeness.down,
    name: '20260712_153000_collection_versions_completeness',
  },
  {
    up: migration_20260712_154000_mcp_describe_resource.up,
    down: migration_20260712_154000_mcp_describe_resource.down,
    name: '20260712_154000_mcp_describe_resource',
  },
  {
    up: migration_20260713_110500_site_novel_home_toggle.up,
    down: migration_20260713_110500_site_novel_home_toggle.down,
    name: '20260713_110500_site_novel_home_toggle',
  },
  {
    up: migration_20260717_141000_config_center_p0.up,
    down: migration_20260717_141000_config_center_p0.down,
    name: '20260717_141000_config_center_p0',
  },
  {
    up: migration_20260717_142000_locked_docs_llm_prompt_rels.up,
    down: migration_20260717_142000_locked_docs_llm_prompt_rels.down,
    name: '20260717_142000_locked_docs_llm_prompt_rels',
  },
  {
    up: migration_20260717_150000_config_center_p1.up,
    down: migration_20260717_150000_config_center_p1.down,
    name: '20260717_150000_config_center_p1',
  },
  {
    up: migration_20260717_160000_config_center_p2.up,
    down: migration_20260717_160000_config_center_p2.down,
    name: '20260717_160000_config_center_p2',
  },
  {
    up: migration_20260717_170000_ai_canvases.up,
    down: migration_20260717_170000_ai_canvases.down,
    name: '20260717_170000_ai_canvases',
  },
  {
    up: migration_20260717_180000_ai_settings_embedding.up,
    down: migration_20260717_180000_ai_settings_embedding.down,
    name: '20260717_180000_ai_settings_embedding',
  },
  {
    up: migration_20260717_190000_drop_ai_legacy_env.up,
    down: migration_20260717_190000_drop_ai_legacy_env.down,
    name: '20260717_190000_drop_ai_legacy_env',
  },
  {
    up: migration_20260717_191000_drop_orphan_ai_settings_enums.up,
    down: migration_20260717_191000_drop_orphan_ai_settings_enums.down,
    name: '20260717_191000_drop_orphan_ai_settings_enums',
  },
  {
    up: migration_20260718_140000_galleries.up,
    down: migration_20260718_140000_galleries.down,
    name: '20260718_140000_galleries',
  },
  {
    up: migration_20260718_143000_galleries_bulk_images.up,
    down: migration_20260718_143000_galleries_bulk_images.down,
    name: '20260718_143000_galleries_bulk_images',
  },
  {
    up: migration_20260718_150000_search_v_rels_galleries.up,
    down: migration_20260718_150000_search_v_rels_galleries.down,
    name: '20260718_150000_search_v_rels_galleries',
  },
  {
    up: migration_20260719_100000_users_avatar.up,
    down: migration_20260719_100000_users_avatar.down,
    name: '20260719_100000_users_avatar',
  },
  {
    up: migration_20260720_100000_authz_roles.up,
    down: migration_20260720_100000_authz_roles.down,
    name: '20260720_100000_authz_roles',
  },
];
