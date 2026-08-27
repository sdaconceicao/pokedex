import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordAttemptsToUsers_1787863500000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Shared state for the change-password lockout. On Vercel's serverless
    // runtime an in-memory limiter is close to useless — instances are ephemeral
    // and scale horizontally, so each keeps its own counter. Postgres is the
    // only store this stack already has that every instance sees.
    //
    // Named for passwords rather than for the endpoint so the unauthenticated
    // login path — which has the same exposure, and worse — can reuse it later
    // without another migration.
    await queryRunner.query(`
      ALTER TABLE "users"."users"
      ADD COLUMN "failedPasswordAttempts" smallint NOT NULL DEFAULT 0,
      ADD COLUMN "passwordLockedUntil" TIMESTAMP WITH TIME ZONE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"."users"
      DROP COLUMN IF EXISTS "failedPasswordAttempts",
      DROP COLUMN IF EXISTS "passwordLockedUntil"
    `);
  }
}
