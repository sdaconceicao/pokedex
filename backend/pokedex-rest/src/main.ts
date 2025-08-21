import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { UserEntity } from './users/users.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS with configurable origins
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  console.log('NODE_ENV', process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'test') {
    try {
      const configService = app.get(ConfigService);

      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('database.host')!,
        port: configService.get<number>('database.port')!,
        username: configService.get<string>('database.username')!,
        password: configService.get<string>('database.password')!,
        database: configService.get<string>('database.database')!,
        schema: configService.get<string>('database.schema')!,
        entities: [UserEntity],
        seeds: ['src/**/*.seed{.ts,.js}'],
        seedTracking: false,
      } as DataSourceOptions & SeederOptions);

      await dataSource.initialize();

      // Create users schema if it doesn't exist
      await dataSource.query('CREATE SCHEMA IF NOT EXISTS users');

      // Grant privileges to pokedex_user
      await dataSource.query(`
        GRANT ALL PRIVILEGES ON SCHEMA users TO pokedex_user;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA users TO pokedex_user;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA users TO pokedex_user;
        ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON TABLES TO pokedex_user;
        ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON SEQUENCES TO pokedex_user;
      `);
      await runSeeders(dataSource);
      console.log('Database seeded successfully for test environment');
      await dataSource.destroy();
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
