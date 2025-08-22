import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable_1755811500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the users table in the users schema
    await queryRunner.query(`
      CREATE TABLE "users"."users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying(50) NOT NULL,
        "password" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "firstName" character varying(255) NOT NULL,
        "lastName" character varying(255) NOT NULL,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_users_username" ON "users"."users" ("username")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users"."users" ("email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the users table
    await queryRunner.query(`DROP TABLE IF EXISTS "users"."users" CASCADE`);
  }
}
