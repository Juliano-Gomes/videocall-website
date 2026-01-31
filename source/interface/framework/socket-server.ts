import {Server} from 'socket.io'
import {createServer} from 'http'

type messageProps = {
    username:string,
    userId:string,
    subRoomId:string,
    message:string,
    roomId:string
}
type propsRoom={
    userId:string,
    roomId:string,
}

export class SocketI{
    private io
    constructor(props:{
        socket:typeof Server,
        server:typeof createServer
    }){
       this.io = new props.socket(props.server())

       
       //setting up socketIo
       this.io.on("connection",socket=>{
           //connect to a room 
           socket.on("enterMessageRoom",(propsRoom:propsRoom)=>{
            
           })
           socket.on("message",(messageProps:messageProps)=>{
            //in the end of the day .
            socket.broadcast.to(messageProps.subRoomId).emit("roomMessage",{
                from:messageProps.username,
                userId:messageProps.userId,
                message:messageProps.message
            })
           })
       })
    }
}