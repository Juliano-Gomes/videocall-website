import { createRoomError } from "../Errors/error.entities"

interface addProps{
    roomId : string,
    userid:string,
    username:string,
}

export class AddMemberToRoom{
    constructor(private AddProps:addProps){
        if(!this.AddProps.roomId){
            throw new createRoomError({
                name:"Inexistent id",
                message:"id of the room was not passed",
                where: __filename ,
                cause:"Id not passed , Line : 17 "
            })
        }
        if(!this.AddProps.userid || !this.AddProps.username){
            throw new createRoomError({
                name:"Inexistent userid / username",
                message:"id of the member was not passed",
                where: __filename ,
                cause:"Id not passed , Line : 25 "
            })
        }
    }

    get UserToAdd(){
        return {...this.AddProps,privilege:"user", addedAt:new Date()}
    }
}