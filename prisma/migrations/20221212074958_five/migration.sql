/*
  Warnings:

  - You are about to drop the column `role_Id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_Id_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role_Id`,
    ADD COLUMN `role_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_role_id_key` ON `User`(`role_id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE SET NULL ON UPDATE CASCADE;
