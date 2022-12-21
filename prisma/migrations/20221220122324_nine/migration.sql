/*
  Warnings:

  - Made the column `scale` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `scale` VARCHAR(191) NOT NULL;
