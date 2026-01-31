-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "subRoomId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_subRoomId_fkey" FOREIGN KEY ("subRoomId") REFERENCES "SubRoom"("subRoomId") ON DELETE RESTRICT ON UPDATE CASCADE;
