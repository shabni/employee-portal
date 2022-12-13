-- AlterTable
ALTER TABLE `session` MODIFY `fName` VARCHAR(191) NULL,
    MODIFY `is_LoggedIn` BOOLEAN NULL DEFAULT false,
    MODIFY `is_CheckedIn` BOOLEAN NULL DEFAULT false,
    MODIFY `date_updated` BIGINT NULL,
    MODIFY `date_added` BIGINT NULL,
    MODIFY `is_deleted` BOOLEAN NULL DEFAULT false;
