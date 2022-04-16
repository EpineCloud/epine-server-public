import * as db from './src/database'

export = {
  ...db.knexConfig,
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/migration.template.ts',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    stub: './src/database/seed.template.ts',
    extension: 'ts',
  },
}
