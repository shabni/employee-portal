-- CreateTable
CREATE TABLE `Tasks` (
    `taskId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`taskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskTracks` (
    `taskTrackId` VARCHAR(191) NOT NULL,
    `startDate` BIGINT NOT NULL,
    `endDate` BIGINT NOT NULL,
    `duration` BIGINT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `attendenceId` VARCHAR(191) NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`taskTrackId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaskTracks` ADD CONSTRAINT `TaskTracks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskTracks` ADD CONSTRAINT `TaskTracks_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`taskId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskTracks` ADD CONSTRAINT `TaskTracks_attendenceId_fkey` FOREIGN KEY (`attendenceId`) REFERENCES `Attendence`(`attendenceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
