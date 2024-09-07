-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
