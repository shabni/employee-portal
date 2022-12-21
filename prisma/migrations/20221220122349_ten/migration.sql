/*
  Warnings:

  - You are about to alter the column `scale` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `scale` INTEGER NOT NULL;
