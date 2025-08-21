import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
      ): PostgresConnectionOptions => ({
        type: 'postgres',
        host: configService.get('database.host')!,
        port: configService.get('database.port')!,
        username: configService.get('database.username')!,
        password: configService.get('database.password')!,
        database: configService.get('database.database')!,
        schema: configService.get('database.schema')!,
        entities: configService.get('database.entities')!,
        synchronize: configService.get('database.synchronize')!,
        logging: configService.get('database.logging')!,
        extra: {
          afterConnect: async (connection: Connection) => {
            // Create users schema if it doesn't exist
            await connection.query('CREATE SCHEMA IF NOT EXISTS users');

            // Grant privileges to pokedex_user
            await connection.query(`
              GRANT ALL PRIVILEGES ON SCHEMA users TO pokedex_user;
              GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA users TO pokedex_user;
              GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA users TO pokedex_user;
              ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON TABLES TO pokedex_user;
              ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON SEQUENCES TO pokedex_user;
            `);
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
