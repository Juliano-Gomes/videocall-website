import { createRoomError } from "../Errors/error.entities"

type propsRoom = {
    roomId :string,
    subRoomId:string,
    subRoomName:string,
    subRoomType : "call" | "message" | "announcements" | "private"
}

export class SubRoomEntity{
    constructor(private sub : propsRoom){
        if(!this.sub.roomId || !this.sub.subRoomName){
            throw new createRoomError({
                name:"sub room",
                where:__filename,
                message:"invalid information to create a sub room",
                cause:"invalid info about room , Line : 17"
            })
        }
    }

    get SubRoom(){
        return this.sub
    }
}