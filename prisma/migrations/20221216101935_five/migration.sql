/*
  Warnings:

  - You are about to drop the column `boss1` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `boss2` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `boss3` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `boss1`,
    DROP COLUMN `boss2`,
    DROP COLUMN `boss3`;
