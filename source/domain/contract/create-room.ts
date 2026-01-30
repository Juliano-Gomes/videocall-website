export interface CreateRoomI{
    create:(props:{roomTitle:string,owner:{name:string,id:string},description:string})=>Promise<{message:string,roomId:string,roomTile:string}>
}

