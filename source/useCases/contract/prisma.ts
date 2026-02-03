type findResponse = {
    userId : string,
    username:string,
} 
type Members = {
    roomId:string,
    username:string,
    userId:string,
    privilege:string,//"super_user_admin" | "user",
    addedAt:Date
}

type Room=  {
    roomId:string,
    roomTitle:string,
    description:string,
    owner:{
        id:string,
        name:string
    },
    room_link:string,
    createdAt:Date,
    members:Members[]
}

export interface prismaI{
    findUser : (props:{userId:string})=>Promise<{response:findResponse , error? :string}>,

    createRoom : (props:{
        roomId:string,
        roomTitle:string,
        description:string,
        members:Members[],
        owner:{
            id:string,
            name:string
        },
        room_link:string,
        createdAt:Date,
    })=>Promise<{message:string}>,

    findRoom:(props:{
        roomId : string
    })=>Promise<{room:Room}>,

    createSubRoom:(props:{
        roomId :string,
        subRoomId:string,
        subRoomName:string,
        subRoomType : "call" | "message" | "announcements" | "private"
    })=> Promise<{message:string}>,

    addUserToRoom:(props:{
        roomId : string,
        userid:string,
        username:string,
        addedAt:Date,
        privilege: string
    })=>Promise<{message:string}>,

    IsMember:(props:{roomId:string,userId:string})=>Promise<boolean>,

    isUserAlreadyAdmin:(props:{
        roomId:string,
        userId:string
    })=>Promise<boolean>,

    turnUserToAdmin:(props:{
        userid:string,
        username:string,
        privilege:string,
        addedAt:Date,
        roomId:string,
    })=>Promise<{message:string}>,

    createUser:(props:{
        username:string,
        userId:string,
        communitiesRooms?:{
            roomId:string,
            RoomTitle:string,
            communityId:string
        }[]
    })=>Promise<{message:string}>,
    retrieve:(props:{roomId:string})=>Promise<{roomInfo:any}>,
    sendMessage:(props:{roomId:string,username:string,userId:string,subRoomId:string,message:string})=>Promise<{message:string}>,
    LoginUser:(props:{username:string,userUniqueKey:string})=>Promise<{User:any}>,
    searchRoom:(props:{name:string})=>Promise<{rooms:{roomId:string,roomTitle:string,members:number,room_link:string,createdAt:string}[]}>
}