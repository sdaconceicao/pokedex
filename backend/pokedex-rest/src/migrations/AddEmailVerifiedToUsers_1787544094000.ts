import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerifiedToUsers_1787544094000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Existing rows land unverified: accounts predating verification must
    // confirm their address like anyone else before they can sign in again.
    await queryRunner.query(`
      ALTER TABLE "users"."users"
      ADD COLUMN "emailVerified" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"."users" DROP COLUMN IF EXISTS "emailVerified"
    `);
  }
}
