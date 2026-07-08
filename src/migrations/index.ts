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
    name: '20260706_143634_short_links'
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
];
