/*
  Warnings:

  - You are about to drop the column `attendenceId` on the `tasktracks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tasktracks` DROP FOREIGN KEY `TaskTracks_attendenceId_fkey`;

-- AlterTable
ALTER TABLE `tasktracks` DROP COLUMN `attendenceId`;
