import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { UserEntity } from './users/users.entity';
import { WinstonModule } from 'nest-winston';
import { createWinstonLogger } from './config/logging.config';

async function bootstrap() {
  const winstonLogger = createWinstonLogger({
    level: process.env.LOG_LEVEL || 'info',
    directory: process.env.LOG_DIRECTORY || 'logs',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    filename: process.env.LOG_FILENAME || 'application-%DATE%.log',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        instance: winstonLogger,
      }),
    },
  );

  // Enable CORS with configurable origins
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0)
    : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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
      await runSeeders(dataSource);
      Logger.log('Database seeded successfully for test environment');
      await dataSource.destroy();
    } catch (error) {
      Logger.error('Error seeding database:', error);
    }
  }

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
