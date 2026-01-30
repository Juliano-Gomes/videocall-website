export interface CreateRoomI{
    create:(props:{roomTitle:string,owner:{id:string},description:string})=>Promise<{message:string,roomId:string,roomTile:string}>
}

