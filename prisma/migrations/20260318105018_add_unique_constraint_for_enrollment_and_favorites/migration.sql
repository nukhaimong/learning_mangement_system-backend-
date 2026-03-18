/*
  Warnings:

  - You are about to drop the `favourites` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[course_id,learner_id]` on the table `enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "favourites" DROP CONSTRAINT "favourites_course_id_fkey";

-- DropForeignKey
ALTER TABLE "favourites" DROP CONSTRAINT "favourites_learner_id_fkey";

-- DropTable
DROP TABLE "favourites";

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "course_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorites_course_id_idx" ON "favorites"("course_id");

-- CreateIndex
CREATE INDEX "favorites_learner_id_idx" ON "favorites"("learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_course_id_learner_id_key" ON "favorites"("course_id", "learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_course_id_learner_id_key" ON "enrollment"("course_id", "learner_id");

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
