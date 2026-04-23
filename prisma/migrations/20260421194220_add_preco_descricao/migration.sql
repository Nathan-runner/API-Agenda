/*
  Warnings:

  - Added the required column `preco` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL;
