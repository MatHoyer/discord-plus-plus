-- AlterTable
ALTER TABLE "ServerMessage" ADD COLUMN     "referencedMessageId" INTEGER;

-- CreateIndex
CREATE INDEX "ServerMessage_referencedMessageId_idx" ON "ServerMessage"("referencedMessageId");

-- AddForeignKey
ALTER TABLE "ServerMessage" ADD CONSTRAINT "ServerMessage_referencedMessageId_fkey" FOREIGN KEY ("referencedMessageId") REFERENCES "ServerMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
