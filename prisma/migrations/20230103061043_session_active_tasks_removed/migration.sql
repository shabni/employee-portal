/*
  Warnings:

  - You are about to drop the column `activeTaskTitle` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `activeTasskId` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `session` DROP COLUMN `activeTaskTitle`,
    DROP COLUMN `activeTasskId`;
