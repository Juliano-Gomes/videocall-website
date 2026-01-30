import { createRoomError } from "../Errors/error.entities";

// type Admins={
//     roomId:string
//     userid:string,
//     username:string,
//     privilege:"super_user_admin",
//     addedAt:Date
// }

interface RoomI{
    roomId:string,
    RoomTitle:string,
    description:string,
    owner:{
        id:string,
        name:string
    },
}

export class RoomEntity{
    private RoomAttribute : RoomI

    constructor(props:RoomI){
        if(props.roomId.trim() === "" || !props.roomId){
            throw new createRoomError({
                name:"Inexistent id",
                message:"id of the room was not passed",
                where: __filename ,
                cause:"Id not passed , Line : 30 "
            })
        }
        if(props.RoomTitle.trim() === "" || !props.RoomTitle){
            throw new createRoomError({
                name:"Inexistent room title",
                message:"room title  was not passed",
                where: __filename ,
                cause:"call title not passed , Line : 38 "
            })
        }
        if(!props.owner || !props.owner.id || !props.owner.name){
            throw new createRoomError({
                name:"Inexistent room creator",
                message:"room creator was not passed",
                where: __filename ,
                cause:"room creator was not passed , Line : 46 "
            })
        }

        this.RoomAttribute = props
    }

    get GetRoomAttributes(){
        return {
            ...this.RoomAttribute,
            members:[{
                roomId:this.RoomAttribute.roomId,
                username:this.RoomAttribute.owner.name,
                userId:this.RoomAttribute.owner.id,
                privilege:"super_user_admin",
                addedAt:new Date()
            }],
            createdAt:new Date(),
        }
    }
}
