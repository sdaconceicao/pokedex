export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'pokedex_user',
  password: process.env.DB_PASSWORD || 'pokedex_password',
  database: process.env.DB_DATABASE || 'pokedex',
  schema: process.env.DB_SCHEMA || 'users',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};
