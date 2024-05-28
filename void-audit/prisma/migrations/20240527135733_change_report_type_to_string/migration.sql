/*
  Warnings:

  - Made the column `report` on table `Audit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Audit` MODIFY `report` VARCHAR(30) NOT NULL;
