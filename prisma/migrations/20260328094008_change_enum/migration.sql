/*
  Warnings:

  - The values [Advance] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('Beginner', 'Intermediate', 'Advanced');
ALTER TABLE "course" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "public"."Level_old";
COMMIT;
