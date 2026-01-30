import { prisma } from "../../lib/prisma";
import { prismaI } from "../useCases/contract/prisma";

export class PrismaAdapter implements prismaI{
    constructor(private prismaI : typeof prisma){}

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
            throw new Error()
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
            throw new Error()
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
            throw new Error()
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
            throw new Error()
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
            throw new Error()
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
            throw new Error()
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