import * as migration_20260702_082942_initial from './20260702_082942_initial';
import * as migration_20260703_102200_frontend_theme from './20260703_102200_frontend_theme';
import * as migration_20260703_132700_frontend_theme_cms from './20260703_132700_frontend_theme_cms';
import * as migration_20260706_112800_site_record_settings from './20260706_112800_site_record_settings';
import * as migration_20260706_114900_link_groups from './20260706_114900_link_groups';
import * as migration_20260706_133157 from './20260706_133157';
import * as migration_20260706_143634_short_links from './20260706_143634_short_links';

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
];
