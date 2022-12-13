-- CreateTable
CREATE TABLE `Session` (
    `session_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `joining_date` BIGINT NULL,
    `is_LoggedIn` BOOLEAN NOT NULL DEFAULT false,
    `is_CheckedIn` BOOLEAN NOT NULL DEFAULT false,
    `role_id` VARCHAR(191) NULL,
    `emailOffice` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phone` INTEGER NULL,
    `date_updated` BIGINT NOT NULL,
    `date_added` BIGINT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `attendence_date` BIGINT NULL,
    `check_in_time` BIGINT NULL,
    `check_out_time` BIGINT NULL,

    UNIQUE INDEX `Session_userName_key`(`userName`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
