-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('TODOS', 'OPENAI');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "Permission"[] DEFAULT ARRAY['TODOS']::"Permission"[];
