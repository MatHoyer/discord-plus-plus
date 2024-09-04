-- CreateTable
CREATE TABLE "ServerMessageReaction" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerMessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServerMessageReaction_messageId_idx" ON "ServerMessageReaction"("messageId");

-- CreateIndex
CREATE INDEX "ServerMessageReaction_memberId_idx" ON "ServerMessageReaction"("memberId");

-- AddForeignKey
ALTER TABLE "ServerMessageReaction" ADD CONSTRAINT "ServerMessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ServerMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMessageReaction" ADD CONSTRAINT "ServerMessageReaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
