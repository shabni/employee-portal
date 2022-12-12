-- CreateTable
CREATE TABLE `Roles` (
    `role_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Roles_title_key`(`title`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `joining_date` BIGINT NOT NULL,
    `nic` VARCHAR(191) NOT NULL,
    `boss1` VARCHAR(191) NULL,
    `boss2` VARCHAR(191) NULL,
    `boss3` VARCHAR(191) NULL,
    `is_LoggedIn` BOOLEAN NOT NULL DEFAULT false,
    `is_CheckedIn` BOOLEAN NOT NULL DEFAULT false,
    `role_id` VARCHAR(191) NULL,
    `emailOffice` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phone` INTEGER NULL,
    `date_updated` BIGINT NOT NULL,
    `date_added` BIGINT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_userName_key`(`userName`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendence` (
    `attendence_id` VARCHAR(191) NOT NULL,
    `attendence_date` BIGINT NOT NULL,
    `check_in_time` BIGINT NOT NULL,
    `check_out_time` BIGINT NOT NULL,
    `user_Id` VARCHAR(191) NOT NULL,
    `date_updated` BIGINT NOT NULL,
    `date_added` BIGINT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`attendence_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`role_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendence` ADD CONSTRAINT `Attendence_user_Id_fkey` FOREIGN KEY (`user_Id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
