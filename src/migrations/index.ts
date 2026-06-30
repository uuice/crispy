import * as migration_20260630_030419_initial from './20260630_030419_initial';

export const migrations = [
  {
    up: migration_20260630_030419_initial.up,
    down: migration_20260630_030419_initial.down,
    name: '20260630_030419_initial'
  },
];
