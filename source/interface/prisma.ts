import { prismaI } from "../useCases/contract/prisma";

export class PrismaAdapter implements prismaI{
    constructor(private prismaI : any){}

    async findUser (props: { userId: string; }) : Promise<{ response: { userId: string; username: string; }; error?: string; }>{
        const response_data = await this.prismaI.Users.findFirst({
            where:{
                id:props.userId
            },
            select:{
                userId:true,
                username:true
            }
        })

        if(!response_data){
            throw new Error()
        }
        return{
            response:{
                userId:response_data.userId,
                username:response_data.username
            }
        }
    }

    async createRoom (props: { roomId: string; roomTitle: string; description: string; members: { roomId: string; username: string; userId: string; privilege: string; addedAt: Date; }[]; owner: { id: string; name: string; }; room_link: string; createdAt: Date; }) : Promise<{ message: string; }>{
        const response = await this.prismaI.Rooms.create({
            data:{
                props
            }
        })

        return{
            message:"room created"
        }
    }
    
    async findRoom (props: { roomId: string; }) : Promise<{ room: { roomId: string; roomTitle: string; description: string; owner: { id: string; name: string; }; room_link: string; createdAt: Date; members: { roomId: string; username: string; userId: string; privilege: string; addedAt: Date; }[]; }; }>{
        const Rooms = await this.prismaI.Rooms.findFirst({
            where:{
                roomId : props.roomId
            }
        })

        return Rooms
    }
    
    async createSubRoom (props: { roomId: string; subRoomId: string; subRoomName: string; subRoomType: "call" | "message" | "announcements" | "private"; }) : Promise<{ message: string; }>{
        const response = await this.prismaI.SubRoom.create({
            data:{
                props
            }
        })

        return{
            message:"sub room created !"
        }
    }
    
    async addUserToRoom (props: { roomId: string; userid: string; username: string; addedAt: Date; privilege: string; }) : Promise<{ message: string; }>{
        const RoomMembers = await this.prismaI.Rooms.findFirst({
            where:{
                roomId:props.roomId
            },
            select:{
                members:true
            }
        })
        RoomMembers.members.push(props)

        // add new user
        const Room = await this.prismaI.Rooms.update({
            where:{
                roomId:props.roomId
            },
            data:{
                members:RoomMembers.members
            }
        })

        return {
            message:"User added "
        }
    }
    
    async IsMember (props: { roomId: string; userId: string; }) : Promise<boolean>{
        const AllMembers = await this.prismaI.Rooms.findFirst({
            where:{
                roomId:props.roomId
            }
        })

        const IsMember = AllMembers.members.filter((member:any)=>{
            return member.userId === props.userId
        })

        if(IsMember && IsMember.userId){
            return true
        }
        return false
    }
    
    async isUserAlreadyAdmin (props: { roomId: string; userId: string; }) : Promise<boolean>{
        const AllMembers = await this.prismaI.Rooms.findFirst({
            where:{
                roomId:props.roomId
            }
        })

        const IsMember = AllMembers.members.filter((member:any)=>{
            return member.userId === props.userId
        })

        if(IsMember && IsMember.userId && IsMember.privilege == process.env.privilege!){
            return true
        }
        return false
    }
    
    async turnUserToAdmin (props: { userid: string; username: string; privilege: string; addedAt: Date; roomId: string; }) : Promise<{ message: string; }>{
        const AllMembers = await this.prismaI.Rooms.findFirst({
            where:{
                roomId:props.roomId
            }
        })

        AllMembers.members = AllMembers.members.filter((member:any)=>{
            if(member.userId === props.userid){
                member = props
            }
            return member
        })

        const update = await this.prismaI.Rooms.update({
            where:{
                roomId:props.roomId
            },
            data:{
                members:AllMembers.members
            }
        })
       return {
            message:`congrats ${props.username} you're now an admin in the ${AllMembers.roomTitle} room`
        }
    }
    
    
    async createUser (props: { username: string; userId: string; communitiesRooms?: { roomId: string; RoomTitle: string; }[]; }) : Promise<{ message: string; }>{
        const User = await this.prismaI.Users.create({
            data:{
                props
            }
        })

        return {
            message:"User Created "
        }
    }
} 