import * as migration_20260702_082942_initial from './20260702_082942_initial';

export const migrations = [
  {
    up: migration_20260702_082942_initial.up,
    down: migration_20260702_082942_initial.down,
    name: '20260702_082942_initial'
  },
];
