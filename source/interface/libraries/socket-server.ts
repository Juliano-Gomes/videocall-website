import type {Server} from 'socket.io'
import type http from 'http'
import { RecordMessage } from '../../useCases/send-message'
import { prisma } from '../../../lib/prisma'
import { PrismaAdapter } from '../prisma'
import { InterfaceLayerError } from '../error-interface-layer/error'

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
        server: http.Server
    }){
        try {
            this.io = new props.socket(props.server)
     
            
            //setting up socketIo
            this.io.on("connection",socket=>{
                //connect to a room 
                socket.on("enterMessageRoom",(propsRoom:propsRoom)=>{
                     socket.join(propsRoom.roomId)
                })
                socket.on("message",(messageProps:messageProps)=>{
                    try {
                        //record the message
                        const PrismaI = new PrismaAdapter(prisma)
                        new RecordMessage(PrismaI).recordMessage(messageProps)
                        //in the end of the day .
                        socket.broadcast.to(messageProps.subRoomId).emit("roomMessage",{
                            from:messageProps.username,
                            userId:messageProps.userId,
                            message:messageProps.message
                        })
                    } catch (error:any) {
                        console.log(error.message)
                    }
                })

                socket.on("leaveRoom",(props:{userId:string,roomId:string})=>{
                    socket.leave(props.roomId)
                })
            })
        } catch (error:any) {
            throw new InterfaceLayerError({
                name:error.name,
                message:error.message,
                cause:error.cause,
                where:__filename,
                statusCode:500
            })
        }
    }
}