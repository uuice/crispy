import * as migration_20260630_030419_initial from './20260630_030419_initial';
import * as migration_20260630_120000_add_ai_provider from './20260630_120000_add_ai_provider';
import * as migration_20260630_130000_add_content_embeddings from './20260630_130000_add_content_embeddings';
import * as migration_20260701_021310_add_app_configs_and_comments from './20260701_021310_add_app_configs_and_comments';
import * as migration_20260701_060256_add_query_presets from './20260701_060256_add_query_presets';

export const migrations = [
  {
    up: migration_20260630_030419_initial.up,
    down: migration_20260630_030419_initial.down,
    name: '20260630_030419_initial',
  },
  {
    up: migration_20260630_120000_add_ai_provider.up,
    down: migration_20260630_120000_add_ai_provider.down,
    name: '20260630_120000_add_ai_provider',
  },
  {
    up: migration_20260630_130000_add_content_embeddings.up,
    down: migration_20260630_130000_add_content_embeddings.down,
    name: '20260630_130000_add_content_embeddings',
  },
  {
    up: migration_20260701_021310_add_app_configs_and_comments.up,
    down: migration_20260701_021310_add_app_configs_and_comments.down,
    name: '20260701_021310_add_app_configs_and_comments',
  },
  {
    up: migration_20260701_060256_add_query_presets.up,
    down: migration_20260701_060256_add_query_presets.down,
    name: '20260701_060256_add_query_presets'
  },
];
