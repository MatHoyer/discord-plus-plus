-- CreateTable
CREATE TABLE "ServerMessageAttachment" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerMessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServerMessageAttachment_messageId_idx" ON "ServerMessageAttachment"("messageId");

-- AddForeignKey
ALTER TABLE "ServerMessageAttachment" ADD CONSTRAINT "ServerMessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ServerMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
