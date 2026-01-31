import { TurnIntoSuperUser } from "../domain/contract/sudo-user";
import { addAdminRoom } from "../domain/Entities/add-admin";
import { createRoomError } from "../domain/Errors/error.entities";
import { prismaI } from "./contract/prisma";

export class TurnUserAdministrator implements TurnIntoSuperUser{
    constructor(private prisma : prismaI){}
    async sudo (props: { newSuperUser: { roomId: string; name: string; id: string; }; administrator: { roomId: string; name: string; id: string; }; roomId: string; }) :Promise<{ message: string; }>{
        // Does group exists
        const newSuperUser = await this.prisma.findUser({
            userId:props.newSuperUser.id
        })
        const administrator = await this.prisma.findUser({
            userId:props.administrator.id
        })
    
        const Room = await this.prisma.findRoom({
            roomId:props.roomId
        })
    
        // validate the responses
        if(!newSuperUser || !newSuperUser.error){
            throw new createRoomError({
                name:"ghost User",
                cause:"passed a invalid user , Line : 21",
                message:"passed a invalid user ",
                where:__filename,
                statusCode:404
            })
        }
        if(!Room.room || !Room){
            throw new createRoomError({
                name:"Invalid Room",
                cause:"passed a invalid room id ; Line : 30",
                message:"passed a invalid room id ",
                where:__filename,
                statusCode:404
            }) 
        }
        //is he/she already member !!
        const IsAdministrator_SuperUser = await this.prisma.isUserAlreadyAdmin({
            userId:administrator.response.userId,
            roomId:Room.room.roomId
        })
        const IsAdministrator_newSuperUser = await this.prisma.isUserAlreadyAdmin({
            userId:newSuperUser.response.userId,
            roomId:Room.room.roomId
        })
        
        if(!IsAdministrator_SuperUser){
            throw new createRoomError({
                name:"Permission Denied",
                message:"User provided is not admin ! You have not permission to do it",
                cause:"permission denied,Line:51",
                where:__filename,
                statusCode:403
            })
        }
        if(IsAdministrator_newSuperUser){
            throw new createRoomError({
                name:"User Already Admin",
                message:"User provided is already admin!",
                cause:"permission denied, Line:58",
                where:__filename,
                statusCode:400
            })
        }

       
        // _apply business logic_
        const admins  = Room.room.members.filter(admin=>{
            return admin.privilege == process.env.privilege!
        })

        if(admins.length <= 0  || typeof(admins) === "undefined"){
            throw new createRoomError({
                name:"admin error",
                message:"no admin passed",
                cause:"forbidden ,Line:75",
                where:__filename,
                statusCode:403
            })
        }

        const newSuperUserDo = new addAdminRoom({
            userId:newSuperUser.response.userId,
            username:newSuperUser.response.username,
            roomId:Room.room.roomId,
            adminId:administrator.response.userId
        },admins).getNewAdmin

        //update user privilege
        const update_user_to_admin = await this.prisma.turnUserToAdmin(newSuperUserDo)

        return update_user_to_admin
    }
}