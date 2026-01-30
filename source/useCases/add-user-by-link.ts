import { addUserToRoom } from "../domain/contract/add-user-in-room-by-link";
import { AddMemberToRoom } from "../domain/Entities/add";
import { createRoomError } from "../domain/Errors/error.entities";
import { prismaI } from "./contract/prisma";

export class AddUserTORoomUseCase implements addUserToRoom{
    constructor(private prisma : prismaI){}
    async add(props: { userId: string; username: string; roomId: string; link: string; }) : Promise<{ message: string; }>{
        // Does the user and group exists 
        const User = await this.prisma.findUser({
            userId:props.userId
        })

        const Room = await this.prisma.findRoom({
            roomId:props.roomId
        })

        // validate the responses
        if(!User || !User.error){
            throw new createRoomError({
                name:"gost User",
                cause:"passed a invalid user ; Line : 21",
                message:"passed a invalid user ",
                where:__filename
            })
        }
        if(!Room.room || !Room){
           throw new createRoomError({
                name:"Invalid Room",
                cause:"passed a invalid room id ; Line : 30",
                message:"passed a invalid room id ",
                where:__filename
            }) 
        }
        //is he/she already member !!
        const IsUserAlreadyMember = await this.prisma.IsMember({
            userId:User.response.userId,
            roomId:Room.room.roomId
        })

        if(IsUserAlreadyMember){
            throw new createRoomError({
                name:"user already exists",
                message:"User is alrady a member of the room",
                cause:"tried to register user more then once,Line:45",
                where:__filename
            })
        }

        //apply the business logic
        const addRoomResponse = new AddMemberToRoom({
            roomId : Room.room.roomId,
            userid:User.response.userId,
            username:User.response.username,
        }).UserToAdd

        const addUserToDatabase = await this.prisma.addUserToRoom(addRoomResponse)

        return {
            message : addUserToDatabase.message
        }
    };
}