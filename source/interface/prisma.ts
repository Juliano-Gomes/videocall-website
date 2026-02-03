import type { prisma } from "../../lib/prisma";
import { prismaI } from "../useCases/contract/prisma";
import { InterfaceLayerError } from "./error-interface-layer/error";

export class PrismaAdapter implements prismaI{
    constructor(private prismaI : typeof prisma){}
    async sendMessage(props: { username: string; roomId:string;userId: string; subRoomId: string; message: string; }) :Promise<{ message: string; }>{
        //is he member 
       const response = await this.IsMember({roomId:props.roomId,userId:props.userId})
       
       if(!response){
            throw new InterfaceLayerError({
                name:"Send Message Error",
                message:"User is not member of the room",
                cause:"Line:57",
                where:__filename,
                statusCode:403
            })
        }
       await this.prismaI.messages.create({
            data:{
                id:crypto.randomUUID().toString(),
                message:props.message,
                userId:props.userId,
                username:props.username,
                subRoomId:props.subRoomId,
            }
       })

        return{
            message:"message recorded"
        }
    }

    async findUser (props: { userId: string; }) : Promise<{ response: { userId: string; username: string; }; error?: string; }>{
        const response_data = await this.prismaI.users.findFirst({
            where:{
                id:props.userId
            },
            select:{
                userUniqueId:true,
                username:true,
                id:true
            }
        })

        if(!response_data || !response_data.id){
            throw new InterfaceLayerError({
                name:"UserNotFound",
                where:__filename,
                cause:"user not found ,Line:103",
                message:"id passed not correspond to a user",
                statusCode:404
            })
        }
        return{
            response:{
                userId:response_data.id,
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

        // adding  the room in the users communities camp
        await this.prismaI.userCommunities.create({
            data:{
                communityId:crypto.randomUUID().toString(),
                usersId:props.owner.id,
                roomId:props.roomId,
                RoomTitle:props.roomTitle
            }
        })

        return{
            message:`http://localhost:3000/${props.room_link}`
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
                where:__filename,
                statusCode:404
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
        await this.prismaI.members.create({
            data:{
                addedAt:props.addedAt,
                id:crypto.randomUUID().toString(),
                privilege:props.privilege,
                roomId:props.roomId,
                userId:props.userid,
                username:props.username
            }
       })
       const title = await this.findRoom({roomId:props.roomId})

       await this.prismaI.userCommunities.create({
            data:{
                communityId:crypto.randomUUID().toString(),
                roomId:title.room.roomId,
                usersId:props.userid, 
                RoomTitle:title.room.roomTitle,
            }
       })

        return {
            message:"User added "
        }
    }
    
    async IsMember (props: { roomId: string; userId: string; }) : Promise<boolean>{
        const data = await this.prismaI.members.findFirst({
            where:{
                roomId:props.roomId,
                userId:props.userId
            }
       })

        if(data && data.userId == props.userId && data.roomId == props.roomId){
            return true
        }
        return false
    }
    
    async isUserAlreadyAdmin (props: { roomId: string; userId: string; }) : Promise<boolean>{
       const data = await this.prismaI.members.findFirst({
            where:{
                roomId:props.roomId,
                userId:props.userId
            }
       })

        if(data && data.userId && data.privilege == process.env.privilege!){
            return true
        }
        return false
    }
    
    async turnUserToAdmin (props: { userid: string;username: string; privilege: string; addedAt: Date; roomId: string; }) : Promise<{ message: string; }>{
        const memberId = await this.memberId({roomId:props.roomId,useId:props.userid})
        await this.prismaI.members.update({
            where:{
                userId:props.userid,
                roomId:props.roomId,
                id:memberId.memberId
            },
            data:{
                privilege:props.privilege,
                addedAt:props.addedAt
            }
        })

        
       return {
            message:`congrats ${props.username} you're now an admin in this room`
        }
    }

    async createUser (props: { username: string; userId: string; communitiesRooms?: { roomId: string; RoomTitle: string,communityId:string }[]; }) : Promise<{ message: string; }>{
        const Unique = `${crypto.randomUUID().toString()}-${props.userId}`
        await this.prismaI.users.create({
            data:{
                id:props.userId,
                username:props.username,
                userUniqueId :Unique ,
                userCommunities:{
                    create:props.communitiesRooms
                }
            }
        })

        return {
            message:`Your Account was created ! Your permanent password Is ${Unique} keepIt ,and do not share it with anyone`
        }
    }

    async LoginUser(props:{username:string,userUniqueKey:string}):Promise<{User:any}>{
        const User = await this.prismaI.users.findFirst({
            where:{
                userUniqueId:props.userUniqueKey,
                username:props.username
            },
            include:{
                userCommunities:true
            }
        })

        if(!User){
            throw new InterfaceLayerError({
                name:"Invalid User",
                message:"invalid Password or name",
                where:__filename,
                cause:"Invalid credentials",
                statusCode:403
            })
        }
        return {
            User
        }
    }

    async memberId(props:{roomId:string,useId:string}):Promise<{memberId:string}>{
        const member = await this.prismaI.members.findFirst({
            where:{
                roomId:props.roomId,
                userId:props.useId
            },
            select:{
                id:true
            }
        })

        if(!member || !member.id){
            throw new InterfaceLayerError({
                name:"member Id",
                message:"unable to get member Id",
                where:__filename,
                cause:"unable to get member Id",
                statusCode:500
            })
        }

        return{
            memberId:member!.id
        }
    }
    async searchRoom(props:{name:string}):Promise<{rooms:{roomId:string,roomTitle:string,members:number,room_link:string,createdAt:string}[]}>{
        const response = await this.prismaI.rooms.findMany({
            where:{
                RoomTitle:{
                    contains:props.name.toLowerCase(),
                    mode:"insensitive"
                }
            },
            select:{
                RoomId:true,
                createdAt:true,
                RoomTitle:true,
                room_link:true,
                members:true
            }
        })

        if(!response){
            throw new InterfaceLayerError({
                statusCode:404,
                name:"find Error",
                message:"your search did not result to anything",
                cause:"no room found",
                where:__filename
            })
        }
        const results = response.map((room)=>{
            return {
                roomId : room.RoomId,
                roomTitle:room.RoomTitle,
                createdAt:new Intl.DateTimeFormat('pt-BR',{
                    dateStyle: 'full',
                    timeStyle: 'medium',
                }).format(room.createdAt),
                members:room.members.length,
                room_link:room.room_link
            }
        })

        return {
            rooms:results
        }
    }

    async retrieve(props:{roomId:string}):Promise<{roomInfo:any}>{
        const result = await this.prismaI.rooms.findFirst({
            where:{
                RoomId:props.roomId
            },
            include:{
                members:true,
                SubRooms:{
                    include:{
                        MessageContainer:true
                    }
                },
                owners:true
            }
        })
        if(!result){
            throw new InterfaceLayerError({
                name:"Room Error",
                message:"Room not found",
                cause:"room not found",
                statusCode:404,
                where:__filename
            })
        }

        return{
            roomInfo:{...result,createdAt:new Intl.DateTimeFormat('pt-BR',{
                    dateStyle: 'full',
                    timeStyle: 'medium',
            }).format(result.createdAt)}
        }
    }
} 