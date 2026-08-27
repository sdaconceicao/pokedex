import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAvatarsTable_1787863400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // One row per user at most, so `userId` is the primary key rather than a
    // surrogate `id` plus a unique index — unlike `groups`, which is 1:many.
    // Being the PK also gives the FK its index for free.
    await queryRunner.query(`
      CREATE TABLE "users"."user_avatars" (
        "userId" uuid NOT NULL,
        "mimeType" character varying(32) NOT NULL,
        "data" bytea NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_avatars_userId" PRIMARY KEY ("userId"),
        CONSTRAINT "FK_user_avatars_userId" FOREIGN KEY ("userId")
          REFERENCES "users"."users"("id") ON DELETE CASCADE,
        -- The 500 KiB ceiling, enforced where it cannot be bypassed. Measured on
        -- the stored bytes, which is the file size — not the base64 the request
        -- carried, which is ~33% larger.
        CONSTRAINT "CK_user_avatars_size" CHECK (octet_length("data") BETWEEN 1 AND 512000),
        -- Raster formats only. An SVG avatar served back from the API origin
        -- would be stored XSS, so the exclusion lives in the schema rather than
        -- only in a validation pipe.
        CONSTRAINT "CK_user_avatars_mime" CHECK (
          "mimeType" IN ('image/png', 'image/jpeg', 'image/webp')
        )
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "users"."user_avatars" CASCADE`,
    );
  }
}
