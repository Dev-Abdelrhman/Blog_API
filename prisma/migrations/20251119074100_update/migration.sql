/*
  Warnings:

  - The `react` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `privacy` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Privacy" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "React" AS ENUM ('love', 'like', 'care');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "react",
ADD COLUMN     "react" "React";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "privacy",
ADD COLUMN     "privacy" "Privacy" DEFAULT 'public';
