-- CreateTable
CREATE TABLE `Reports` (
    `report_id` VARCHAR(191) NOT NULL,
    `report_date` BIGINT NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `date_updated` BIGINT NOT NULL,
    `date_added` BIGINT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
