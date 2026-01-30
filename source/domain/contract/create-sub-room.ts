export interface CreateSubRoom {
    room:(props:{
        roomId : string,
        subRoomName :string,
        subRoomType:"call" | "message" | "announcements" | "private",
    })=>Promise<{
        message:string
    }>
}