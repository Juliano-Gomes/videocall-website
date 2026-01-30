type sudo={
    newSuperUser :{
        roomId:string
        name:string,
        id:string
    },
    administrator : {
        roomId:string
        name:string,
        id:string
    },
    roomId:string
}

export interface TurnIntoSuperUser{
    sudo:(props:sudo)=>Promise<{message:string}>
}
// verify if the user is already member of the room