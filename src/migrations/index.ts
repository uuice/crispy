import * as migration_20260630_030419_initial from './20260630_030419_initial';
import * as migration_20260630_120000_add_ai_provider from './20260630_120000_add_ai_provider';
import * as migration_20260630_130000_add_content_embeddings from './20260630_130000_add_content_embeddings';

export const migrations = [
  {
    up: migration_20260630_030419_initial.up,
    down: migration_20260630_030419_initial.down,
    name: '20260630_030419_initial'
  },
  {
    up: migration_20260630_120000_add_ai_provider.up,
    down: migration_20260630_120000_add_ai_provider.down,
    name: '20260630_120000_add_ai_provider'
  },
  {
    up: migration_20260630_130000_add_content_embeddings.up,
    down: migration_20260630_130000_add_content_embeddings.down,
    name: '20260630_130000_add_content_embeddings'
  },
];
