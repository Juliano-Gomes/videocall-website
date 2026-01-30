export interface addUserToCall{
    add : (props:{userId : string,username:string,roomId:string,link:string})=>Promise<{message:string}>
}
