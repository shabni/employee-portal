-- CreateTable
CREATE TABLE `SubTasks` (
    `subTaskId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `updatedAt` BIGINT NOT NULL,
    `createdAt` BIGINT NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `taskId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SubTasks_title_key`(`title`),
    PRIMARY KEY (`subTaskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubTasks` ADD CONSTRAINT `SubTasks_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Tasks`(`taskId`) ON DELETE RESTRICT ON UPDATE CASCADE;
