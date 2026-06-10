import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { UserEntity } from './users/users.entity';

config();

async function runMigrations() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    username: process.env.DB_USERNAME || 'pokedex_user',
    password: process.env.DB_PASSWORD || 'pokedex_password',
    database: process.env.DB_DATABASE || 'pokedex',
    schema: 'public',
    entities: [UserEntity],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
  });

  await dataSource.initialize();
  const migrations = await dataSource.runMigrations();
  console.log(
    `Ran ${migrations.length} migration(s):`,
    migrations.map((m) => m.name),
  );
  await dataSource.destroy();
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
