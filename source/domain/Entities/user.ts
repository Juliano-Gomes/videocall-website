import { createRoomError } from "../Errors/error.entities";

export class UserEntity{
    constructor(private props:{username:string,userId:string,communitiesRooms?:{roomId:string,RoomTitle:string}[]}){
        if(!this.props.username){
            throw new createRoomError({
                name:"Invalid User",
                cause:"Invalid User,Line : 8",
                message:"Invalid username",
                where:__filename
            })
        }
    }
    get User(){
        return this.props
    }
}