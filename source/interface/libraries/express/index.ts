import express from 'express'
import { createServer } from 'http'
import { SocketI } from '../socket-server'
import { Server as Socket } from 'socket.io'
import { PeerJsI } from '../peer-js-server'
import { ExpressPeerServer } from 'peer'
import cors from 'cors'
import { UserRoute } from './routes/create-user-route'
import { RoomRoute } from './routes/create-room-route'
import { SubRoomRoute } from './routes/create-subRoom-route'
import { EnterRoomRoute } from './routes/enter-room-route'
import { TurnUserAdminRoute } from './routes/sudo-user-route'
import { LoginUserRoute } from './routes/login-user-route'

//Setting up Server
const app = express()
const httpServer = createServer(app)

// setting socketIo
new SocketI({server:httpServer,socket:Socket})

//setting up peer
const PeerInstance = new PeerJsI({expressI:httpServer,peerI:ExpressPeerServer})
app.use("/callRoom",PeerInstance.peerI)

//express settings
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({ origin:"*" }))

//routes
app.use(UserRoute)
app.use(RoomRoute)
app.use(SubRoomRoute)
app.use(EnterRoomRoute)
app.use(TurnUserAdminRoute)
app.use(LoginUserRoute)

export{
    httpServer
} 

