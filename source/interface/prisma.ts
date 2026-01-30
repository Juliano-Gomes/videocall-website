import { prismaI } from "../useCases/contract/prisma";

export class PrismaAdapter implements prismaI{
    constructor(private prismaI : any){}

    async findUser (props: { userId: string; }) : Promise<{ response: { userId: string; username: string; }; error?: string; }>{
        const response_data = await this.prismaI.Users.findUnique({
            data:{
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

    async createRoom (props: { roomId: string; roomTitle: string; description: string; members: { roomId: string; username: string; userId: string; privilege: string; addedAt: Date; }[]; owner: { id: string; name: string; }; room_link: string; createdAt: Date; }) : Promise<{ message: string; }>{}
    
    async findRoom (props: { roomId: string; }) : Promise<{ room: { roomId: string; roomTitle: string; description: string; owner: { id: string; name: string; }; room_link: string; createdAt: Date; members: { roomId: string; username: string; userId: string; privilege: string; addedAt: Date; }[]; }; }>{}
    async createSubRoom (props: { roomId: string; subRoomId: string; subRoomName: string; subRoomType: "call" | "message" | "announcements" | "private"; }) : Promise<{ message: string; }>{}
    async addUserToRoom (props: { roomId: string; userid: string; username: string; addedAt: Date; privilege: string; }) : Promise<{ message: string; }>{}
    async IsMember (props: { roomId: string; userId: string; }) : Promise<boolean>{}
    async isUserAlreadyAdmin (props: { roomId: string; userId: string; }) : Promise<boolean>{}
    async turnUserToAdmin (props: { userid: string; username: string; privilege: string; addedAt: Date; roomId: string; }) : Promise<{ message: string; }>{}
    async createUser (props: { username: string; userId: string; communitiesRooms?: { roomId: string; RoomTitle: string; }[]; }) : Promise<{ message: string; }>{}
} 