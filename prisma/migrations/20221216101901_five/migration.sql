-- AlterTable
ALTER TABLE `user` ADD COLUMN `team_lead_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_team_lead_id_fkey` FOREIGN KEY (`team_lead_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
