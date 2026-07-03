import * as migration_20260702_082942_initial from './20260702_082942_initial';
import * as migration_20260703_102200_frontend_theme from './20260703_102200_frontend_theme';
import * as migration_20260703_132700_frontend_theme_cms from './20260703_132700_frontend_theme_cms';

export const migrations = [
  {
    up: migration_20260702_082942_initial.up,
    down: migration_20260702_082942_initial.down,
    name: '20260702_082942_initial'
  },
  {
    up: migration_20260703_102200_frontend_theme.up,
    down: migration_20260703_102200_frontend_theme.down,
    name: '20260703_102200_frontend_theme'
  },
  {
    up: migration_20260703_132700_frontend_theme_cms.up,
    down: migration_20260703_132700_frontend_theme_cms.down,
    name: '20260703_132700_frontend_theme_cms'
  },
];
