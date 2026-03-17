-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Learner',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
