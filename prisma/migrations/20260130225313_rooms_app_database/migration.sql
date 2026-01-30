-- CreateTable
CREATE TABLE "UserCommunities" (
    "roomId" TEXT NOT NULL,
    "RoomTitle" TEXT NOT NULL,
    "usersId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "privilege" TEXT NOT NULL,
    "addedAt" TEXT NOT NULL,
    "roomId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rooms" (
    "RoomId" TEXT NOT NULL,
    "RoomTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "room_link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "SubRoom" (
    "subRoomId" TEXT NOT NULL,
    "subRoomType" TEXT NOT NULL,
    "subRoomName" TEXT NOT NULL,
    "RoomId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCommunities_roomId_key" ON "UserCommunities"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "members_id_key" ON "members"("id");

-- CreateIndex
CREATE UNIQUE INDEX "owner_id_key" ON "owner"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_RoomId_key" ON "Rooms"("RoomId");

-- CreateIndex
CREATE UNIQUE INDEX "SubRoom_subRoomId_key" ON "SubRoom"("subRoomId");

-- AddForeignKey
ALTER TABLE "UserCommunities" ADD CONSTRAINT "UserCommunities_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "owner_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("RoomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubRoom" ADD CONSTRAINT "SubRoom_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Rooms"("RoomId") ON DELETE SET NULL ON UPDATE CASCADE;
