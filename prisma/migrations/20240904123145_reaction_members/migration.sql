/*
  Warnings:

  - You are about to drop the column `memberId` on the `ServerMessageReaction` table. All the data in the column will be lost.
  - Added the required column `content` to the `ServerMessageReaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServerMessageReaction" DROP CONSTRAINT "ServerMessageReaction_memberId_fkey";

-- DropIndex
DROP INDEX "ServerMessageReaction_memberId_idx";

-- AlterTable
ALTER TABLE "ServerMessageReaction" DROP COLUMN "memberId",
ADD COLUMN     "content" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ServerMessageReactionMember" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "reactionId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerMessageReactionMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServerMessageReactionMember_messageId_idx" ON "ServerMessageReactionMember"("messageId");

-- CreateIndex
CREATE INDEX "ServerMessageReactionMember_memberId_idx" ON "ServerMessageReactionMember"("memberId");

-- AddForeignKey
ALTER TABLE "ServerMessageReactionMember" ADD CONSTRAINT "ServerMessageReactionMember_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "ServerMessageReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMessageReactionMember" ADD CONSTRAINT "ServerMessageReactionMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
