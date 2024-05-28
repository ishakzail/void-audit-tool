/*
  Warnings:

  - Added the required column `emulatedForm` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Audit` ADD COLUMN `emulatedForm` VARCHAR(7) NOT NULL;
