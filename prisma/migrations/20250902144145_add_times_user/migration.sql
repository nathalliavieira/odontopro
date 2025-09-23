-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "times" TEXT[] DEFAULT ARRAY[]::TEXT[];
