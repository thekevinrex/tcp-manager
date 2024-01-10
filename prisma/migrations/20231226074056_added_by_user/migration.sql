/*
  Warnings:

  - Added the required column `by_user` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "by_user" TEXT NOT NULL;
