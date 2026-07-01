import * as migration_20260701_091350_initial from './20260701_091350_initial';

export const migrations = [
  {
    up: migration_20260701_091350_initial.up,
    down: migration_20260701_091350_initial.down,
    name: '20260701_091350_initial'
  },
];
