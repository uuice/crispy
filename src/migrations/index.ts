import * as migration_20260629_095000_initial from './20260629_095000_initial';

export const migrations = [
  {
    up: migration_20260629_095000_initial.up,
    down: migration_20260629_095000_initial.down,
    name: '20260629_095000_initial'
  },
];
