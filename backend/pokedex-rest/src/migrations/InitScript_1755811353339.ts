import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitScript_1755811353339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the users schema first
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS users`);

    // Grant privileges to the user
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON SCHEMA users TO pokedex_user`,
    );
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA users TO pokedex_user`,
    );
    await queryRunner.query(
      `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA users TO pokedex_user`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON TABLES TO pokedex_user`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT ALL PRIVILEGES ON SEQUENCES TO pokedex_user`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS users CASCADE`);
  }
}
