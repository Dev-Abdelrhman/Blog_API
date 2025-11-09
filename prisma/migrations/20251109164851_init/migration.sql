-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "privacy" TEXT DEFAULT 'public',
ALTER COLUMN "published" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
