import { prisma } from "../../lib/prisma";
import { prismaI } from "../useCases/contract/prisma";
import { InterfaceLayerError } from "./error-interface-layer/error";

export class PrismaAdapter implements prismaI{
    constructor(private prismaI : typeof prisma){}
    async sendMessage(props: { username: string; roomId:string;userId: string; subRoomId: string; message: string; }) :Promise<{ message: string; }>{
        const SubRoomInfo = await this.prismaI.subRoom.findFirst({
            where:{
                subRoomId:props.subRoomId
            },
            include:{
                rooms:{
                    where:{
                        RoomId:props.roomId
                    },
                    select:{
                        RoomId:true,
                        RoomTitle:true,
                        members:{
                            where:{
                                userId:props.userId,
                                username:props.username
                            }
                        }
                    }
                },
                MessageContainer:true
            }
        })

        //create the message 
        if(!SubRoomInfo){
            throw new InterfaceLayerError({
                name:"SubRoomError",
                cause:"subRoom not found, Line : 30",
                message:"the room that you are trying to send message Does not exists",
                where:__filename
            })
        }
        if(SubRoomInfo.subRoomType != "message" || SubRoomInfo.rooms!.members.length <= 0 || SubRoomInfo.rooms){
            throw new InterfaceLayerError({
                name:"Send Message Error",
                message:"some problem in sendMessage function",
                cause:"Line:45",
                where:__filename
            })
        }
        const IsMember = SubRoomInfo.rooms!.members.filter((member)=>{
            return (member.userId == props.userId && member.roomId == props.roomId && props.username == member.username)
        })

        if(!IsMember || IsMember.length != 1){
            throw new InterfaceLayerError({
                name:"Send Message Error",
                message:"User is not member of the room",
                cause:"Line:57",
                where:__filename
            })
        }

        SubRoomInfo.MessageContainer.push({
            id:crypto.randomUUID().toString(),
            message:props.message,
            userId:props.userId,
            username:props.username,
            subRoomId:SubRoomInfo.subRoomId
        })

        //update
        const update = await this.prismaI.subRoom.update({
            where:{
                subRoomId:SubRoomInfo.subRoomId,
                subRoomName:SubRoomInfo.subRoomName
            },
            data:{
                MessageContainer:{
                    create:SubRoomInfo.MessageContainer
                }
            }
        })

        return{
            message:"message recorded"
        }
    };

    async findUser (props: { userId: string; }) : Promise<{ response: { userId: string; username: string; }; error?: string; }>{
        const response_data = await this.prismaI.users.findFirst({
            where:{
                id:props.userId
            },
            select:{
                userId:true,
                username:true
            }
        })

        if(!response_data || !response_data.userId){
            throw new InterfaceLayerError({
                name:"UserNotFound",
                where:__filename,
                cause:"user not found ,Line:103",
                message:"id passed not correspond to a user"
            })
        }
        return{
            response:{
                userId:response_data.userId,
                username:response_data.username
            }
        }
    }

    async createRoom (props: {roomId: string; roomTitle: string; description: string; members: { roomId: string; username: string; userId: string; privilege: string; addedAt: Date; }[]; owner: { id: string; name: string; }; room_link: string; createdAt: Date; }) : Promise<{ message: string; }>{
        //members 
        const members  = props.members.map((members)=>{
            return {
                addedAt:members.addedAt,
                userId:members.userId,
                username:members.username,
                privilege:members.privilege,
                id:crypto.randomUUID().toString()
            }
        })
        const response = await this.prismaI.rooms.create({
            data:{
                createdAt:props.createdAt,
                description:props.description,
                room_link:props.room_link,
                RoomId:props.roomId,
                RoomTitle:props.roomTitle,
                owners:{
                    create:{
                        id:crypto.randomUUID().toString(),
                        name:props.owner.name,
                        userId:props.owner.id
                    }
                },
                members:{
                    create:members
                },
            }
        })

        return{
            message:"room created"
        }
    }
    
    async findRoom (props: { roomId: string; }) : Promise<{ room: { roomId: string; roomTitle: string; description: string; owner: { id: string; name: string; }; room_link: string; createdAt: Date; members: { roomId: string; username: string; userId: string; privilege: string; addedAt: Date; }[]; }; }>{
        const Rooms = await this.prismaI.rooms.findFirst({
            where:{
                RoomId : props.roomId,
            },
            include:{
                members:true,
                owners:true,
            }
        })
        if(!Rooms){
            throw new InterfaceLayerError({
                name:"Room Not Found",
                cause:"inexistent room ,Line: 164",
                message:"room not found ,id not correspond to any room",
                where:__filename
            })
        }

        return {
            room:{
                createdAt:Rooms.createdAt,
                description:Rooms.description,
                members:Rooms.members,
                owner:{
                    id:Rooms.owners[0].userId,
                    name:Rooms.owners[0].name
                },
                room_link:Rooms.room_link,
                roomId:Rooms.RoomId,
                roomTitle:Rooms.RoomTitle
            }
        }
    }
    
    async createSubRoom (props: { roomId: string; subRoomId: string; subRoomName: string; subRoomType: "call" | "message" | "announcements" | "private"; }) : Promise<{ message: string; }>{
        const response = await this.prismaI.subRoom.create({
            data:{
                subRoomId:props.subRoomId,
                subRoomName:props.subRoomName,
                subRoomType:props.subRoomType,
                RoomId:props.roomId
            }
        })

        return{
            message:"sub room created !"
        }
    }
    
    async addUserToRoom (props: { roomId: string; userid: string; username: string; addedAt: Date; privilege: string; }) : Promise<{ message: string; }>{
        const RoomMembers = await this.prismaI.rooms.findFirst({
            where:{
                RoomId:props.roomId
            },
            select:{
                members:true
            }
        })
        if(!RoomMembers){
            throw new InterfaceLayerError({
                name:"Insert User To room error",
                cause : "room not found, Line : 213",
                message:"unable to insert user to the room",
                where:__filename
            })
        }

        RoomMembers.members.push({
            addedAt:props.addedAt,
            id:crypto.randomUUID().toString(),
            privilege:props.privilege,
            roomId:props.roomId,
            userId:props.userid,
            username:props.username
        })

        // add new user
        const Room = await this.prismaI.rooms.update({
            where:{
                RoomId:props.roomId
            },
            data:{
                members:{
                    create:RoomMembers.members
                }
            }
        })

        return {
            message:"User added "
        }
    }
    
    async IsMember (props: { roomId: string; userId: string; }) : Promise<boolean>{
        const AllMembers = await this.prismaI.rooms.findFirst({
            where:{
                RoomId:props.roomId
            },
            select:{members:true}
        })
        if(!AllMembers){
            throw new InterfaceLayerError({
                name:"Room not found",
                cause : "room not found, Line : 255",
                message:"unable to find the room",
                where:__filename
            })
        }

        const IsMember = AllMembers.members.filter((member)=>{
            return (member.userId === props.userId && member.roomId === props.roomId)
        })

        if(IsMember && IsMember[0].userId){
            return true
        }
        return false
    }
    
    async isUserAlreadyAdmin (props: { roomId: string; userId: string; }) : Promise<boolean>{
        const AllMembers = await this.prismaI.rooms.findFirst({
            where:{
                RoomId:props.roomId
            },
            select:{
                members:true
            }
        })

        if(!AllMembers){
            throw new InterfaceLayerError({
                name:"room error",
                cause : "room not found, Line : 284",
                message:"unable to find the room",
                where:__filename
            })
        }
        const IsMember = AllMembers.members.filter((member:any)=>{
            return member.userId === props.userId
        })

        if(IsMember && IsMember[0].userId && IsMember[0].privilege == process.env.privilege!){
            return true
        }
        return false
    }
    
    async turnUserToAdmin (props: { userid: string; username: string; privilege: string; addedAt: Date; roomId: string; }) : Promise<{ message: string; }>{
        const AllMembers = await this.prismaI.rooms.findFirst({
            where:{
                RoomId:props.roomId
            },
            select:{
                members:true,
                RoomTitle:true
            }
        })
        if(!AllMembers){
            throw new InterfaceLayerError({
                name:"room error",
                cause : "room not found, Line : 312",
                message:"unable to find the room",
                where:__filename
            })
        }

        AllMembers.members = AllMembers.members.filter((member)=>{
            if(member.userId === props.userid){
                member = {
                    id:crypto.randomUUID().toString(),
                    privilege:props.privilege || process.env.privilege!,
                    addedAt:props.addedAt,
                    roomId:props.roomId,
                    userId:props.userid,
                    username:props.username
                }
            }
            return member
        })

        const update = await this.prismaI.rooms.update({
            where:{
                RoomId:props.roomId
            },
            data:{
                members:{create:AllMembers.members}
            }
        })
       return {
            message:`congrats ${props.username} you're now an admin in the ${AllMembers.RoomTitle} room`
        }
    }
    
    
    async createUser (props: { username: string; userId: string; communitiesRooms?: { roomId: string; RoomTitle: string; }[]; }) : Promise<{ message: string; }>{
        const User = await this.prismaI.users.create({
            data:{
                id:props.userId,
                username:props.username,
                userCommunities:{
                    create:props.communitiesRooms
                }
            }
        })

        return {
            message:"User Created "
        }
    }
} 