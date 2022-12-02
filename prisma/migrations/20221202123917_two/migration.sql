/*
  Warnings:

  - You are about to drop the column `emailpersonal` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `emailpersonal`,
    ADD COLUMN `boss1` VARCHAR(191) NULL,
    ADD COLUMN `boss2` VARCHAR(191) NULL,
    ADD COLUMN `boss3` VARCHAR(191) NULL,
    ADD COLUMN `is_LoggedIn` BOOLEAN NOT NULL DEFAULT false;
