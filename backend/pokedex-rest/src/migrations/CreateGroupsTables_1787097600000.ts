import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupsTables_1787097600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the groups table in the users schema
    await queryRunner.query(`
      CREATE TABLE "users"."groups" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" character varying(50) NOT NULL,
        "isDefault" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_groups_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_groups_user_name" UNIQUE ("userId", "name"),
        CONSTRAINT "FK_groups_userId" FOREIGN KEY ("userId")
          REFERENCES "users"."users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_groups_userId" ON "users"."groups" ("userId")
    `);

    // Partial unique index: enforces at most one default group per user.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_groups_user_default"
        ON "users"."groups" ("userId") WHERE "isDefault"
    `);

    // Create the group_pokemon table in the users schema
    await queryRunner.query(`
      CREATE TABLE "users"."group_pokemon" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "groupId" uuid NOT NULL,
        "pokemonId" character varying(64) NOT NULL,
        "speciesId" character varying(64) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_group_pokemon_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_group_pokemon_group_pokemon" UNIQUE ("groupId", "pokemonId"),
        CONSTRAINT "FK_group_pokemon_groupId" FOREIGN KEY ("groupId")
          REFERENCES "users"."groups"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_group_pokemon_groupId" ON "users"."group_pokemon" ("groupId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the group_pokemon table
    await queryRunner.query(
      `DROP TABLE IF EXISTS "users"."group_pokemon" CASCADE`,
    );
    // Drop the groups table
    await queryRunner.query(`DROP TABLE IF EXISTS "users"."groups" CASCADE`);
  }
}
