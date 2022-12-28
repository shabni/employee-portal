-- CreateTable
CREATE TABLE `Roles` (
    `roleId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `scale` INTEGER NOT NULL,
    `permissions` VARCHAR(500) NULL,
    `createdAt` BIGINT NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Roles_title_key`(`title`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `userId` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NOT NULL,
    `lName` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `joiningDate` BIGINT NOT NULL,
    `nic` VARCHAR(191) NOT NULL,
    `isLoggedIn` BOOLEAN NOT NULL DEFAULT false,
    `isCheckedIn` BOOLEAN NOT NULL DEFAULT false,
    `roleId` VARCHAR(191) NULL,
    `emailOffice` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phone` INTEGER NULL,
    `profileImage` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `teamLeadId` VARCHAR(191) NULL,

    UNIQUE INDEX `Users_userName_key`(`userName`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendence` (
    `attendenceId` VARCHAR(191) NOT NULL,
    `attendenceDate` BIGINT NOT NULL,
    `checkInTime` BIGINT NOT NULL,
    `checkOutTime` BIGINT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`attendenceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fName` VARCHAR(191) NULL,
    `lName` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `joiningDate` BIGINT NULL,
    `isLoggedIn` BOOLEAN NULL DEFAULT false,
    `isCheckedIn` BOOLEAN NULL DEFAULT false,
    `roleId` VARCHAR(191) NULL,
    `emailOffice` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phone` INTEGER NULL,
    `updatedAt` BIGINT NULL,
    `createdAt` BIGINT NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `attendenceDate` BIGINT NULL,
    `checkInTime` BIGINT NULL,
    `checkOutTime` BIGINT NULL,
    `profileImage` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,

    UNIQUE INDEX `Session_userName_key`(`userName`),
    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reports` (
    `reportId` VARCHAR(191) NOT NULL,
    `reportDate` BIGINT NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`reportId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Roles`(`roleId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_teamLeadId_fkey` FOREIGN KEY (`teamLeadId`) REFERENCES `Users`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendence` ADD CONSTRAINT `Attendence_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
