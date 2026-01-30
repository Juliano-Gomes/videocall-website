import { createRoomError } from "../Errors/error.entities"

interface adminInfo{
    userId:string,
    username:string,
    roomId:string,
    adminId:string
}

type Adder={
    roomId:string
    userid:string,
    username:string,
    privilege:"super_user_admin",
    addedAt:Date
}

export class addAdminRoom{
    constructor(private admin:adminInfo,RoomAdminsInfo:Adder[]){
        //id this.admin.adminId admin !! - 
        const IsAdmin = RoomAdminsInfo.map((admin)=>{
            if( admin.userid === this.admin.adminId && admin.roomId === this.admin.roomId){
                return admin
            }
        })

        if(!this.admin.adminId || IsAdmin.length <= 0){
            throw new createRoomError({
                name:"permission error",
                message:"you don't have permission to enter this room",
                where:__filename,
                cause:"permission error , Line : 32"
            })
        }
        if(!this.admin.roomId){
            throw new createRoomError({
                name:"room not passed",
                message:"you have to provide the room id",
                where:__filename,
                cause:"permission error , Line : 40"
            })
        }
    }

    get getNewAdmin(){
        return {
            userid:this.admin.userId,
            username:this.admin.username,
            privilege:"super_user_admin",
            addedAt:new Date(),
            roomId:this.admin.roomId
        }
    }
}