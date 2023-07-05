/*
  Warnings:

  - You are about to drop the `attendence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasktracks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `attendence` DROP FOREIGN KEY `Attendence_userId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tasktracks` DROP FOREIGN KEY `TaskTracks_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `tasktracks` DROP FOREIGN KEY `TaskTracks_userId_fkey`;

-- DropTable
DROP TABLE `attendence`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `tasktracks`;

-- CreateTable
CREATE TABLE `Attendence` (
    `attendenceId` VARCHAR(191) NOT NULL,
    `attendenceDate` BIGINT NOT NULL,
    `checkInTime` BIGINT NOT NULL,
    `checkOutTime` BIGINT NULL,
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

    UNIQUE INDEX `Session_userId_key`(`userId`),
    UNIQUE INDEX `Session_userName_key`(`userName`),
    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskTracks` (
    `taskTrackId` VARCHAR(191) NOT NULL,
    `startDate` BIGINT NOT NULL,
    `endDate` BIGINT NULL,
    `duration` BIGINT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`taskTrackId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendence` ADD CONSTRAINT `Attendence_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskTracks` ADD CONSTRAINT `TaskTracks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskTracks` ADD CONSTRAINT `TaskTracks_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`taskId`) ON DELETE RESTRICT ON UPDATE CASCADE;
