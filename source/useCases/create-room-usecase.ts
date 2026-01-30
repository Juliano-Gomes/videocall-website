import { CreateRoomI } from "../domain/contract/create-room";
import { RoomEntity } from "../domain/Entities/room";
import { createRoomError } from "../domain/Errors/error.entities";
import { prismaI } from "./contract/prisma";

export class CreateRoomUseCase implements CreateRoomI{
    constructor(private prisma : prismaI){}
    async create(props: { roomTitle: string; owner: { id: string; }; description: string; }) :Promise<{ message: string; roomId: string; roomTile: string; }>{
        const roomId = crypto.randomUUID().toString()

        // does User Exists 
        const User = await this.prisma.findUser({userId : props.owner.id})

        //validate if User don't exists
        if(User.error){
            throw new createRoomError({
                name:"User not found",
                where:__filename,
                message:"User not exists in database",
                cause:"Inexistent use : Line : 20"
            })
        }
        
        //apply business logic 
        const roomEntity = new RoomEntity({description:props.description,owner:{id:User.response.userId,name:User.response.username},roomId,RoomTitle:props.roomTitle}).GetRoomAttributes
        
        //create Room In the dataBase .
        const create = await this.prisma.createRoom({
            description : roomEntity.description,
            members:roomEntity.members,
            owner:roomEntity.owner,
            roomId:roomEntity.roomId,
            roomTitle:roomEntity.RoomTitle,
            createdAt:roomEntity.createdAt,
            room_link:`/invite/${roomEntity.roomId}`
        })

        //return 
        return { message: create.message, roomId: roomEntity.roomId, roomTile: roomEntity.RoomTitle }
    }
}