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
import { databaseConfig } from './config/database.config';

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

      console.log('database.host', configService.get<string>('database.host'));
      console.log('database.port', configService.get<number>('database.port'));
      console.log(
        'database.username',
        configService.get<string>('database.username'),
      );
      console.log(
        'database.password',
        configService.get<string>('database.password'),
      );
      console.log(
        'database.database',
        configService.get<string>('database.database'),
      );
      console.log(
        'database.schema',
        configService.get<string>('database.schema'),
      );

      const dataSource = new DataSource({
        ...databaseConfig,
        entities: [UserEntity],
        seeds: ['src/**/*.seed{.ts,.js}'],
        seedTracking: false,
      } as DataSourceOptions & SeederOptions);

      await dataSource.initialize();
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
