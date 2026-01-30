import { CreateSubRoom } from "../domain/contract/create-sub-room";
import { SubRoomEntity } from "../domain/Entities/create-sub-room";
import { createRoomError } from "../domain/Errors/error.entities";
import { prismaI } from "./contract/prisma";

export class CreateSubRoomUseCase implements CreateSubRoom{
    constructor(private prisma : prismaI){}
    async room(props: { roomId: string; subRoomName: string; subRoomType: "call" | "message" | "announcements" | "private"; }) : Promise<{ message: string; }>{
        // verify if the group exists.
        const subRoomId = crypto.randomUUID().toString()
        const getRoomInfo = await this.prisma.findRoom({roomId:props.roomId})

        // verify if roo exists
        if(!getRoomInfo){
            throw new createRoomError({
                name:"invalid room",
                cause:"passed a invalid room,Line : 15",
                message:"the room id passed is invalid",
                where:__filename
            })
        }
        //apply the business logic
        const subRoom = new SubRoomEntity({roomId:getRoomInfo.room.roomId,subRoomId,subRoomName:props.subRoomName,subRoomType:props.subRoomType}).SubRoom

        // create the subRoom in the database 
        const subRoomCreationResponse = await this.prisma.createSubRoom(subRoom)

        return subRoomCreationResponse
    };
}