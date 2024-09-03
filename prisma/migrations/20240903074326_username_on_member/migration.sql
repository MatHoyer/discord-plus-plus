/*
  Warnings:

  - You are about to drop the column `userId` on the `ServerMention` table. All the data in the column will be lost.
  - Added the required column `username` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `ServerMention` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServerMention" DROP CONSTRAINT "ServerMention_userId_fkey";

-- DropIndex
DROP INDEX "ServerMention_userId_idx";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServerMention" DROP COLUMN "userId",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ServerMention_memberId_idx" ON "ServerMention"("memberId");

-- AddForeignKey
ALTER TABLE "ServerMention" ADD CONSTRAINT "ServerMention_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
