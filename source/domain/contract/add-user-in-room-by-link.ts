export interface addUserToRoom{
    add : (props:{userId : string,username:string,roomId:string,link:string})=>Promise<{message:string}>
}
