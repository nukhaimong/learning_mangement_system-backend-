/*
  Warnings:

  - Added the required column `intro_video` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "intro_video" TEXT NOT NULL;
