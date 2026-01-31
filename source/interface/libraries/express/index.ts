import express from 'express'
import { createServer } from 'http'
import { SocketI } from '../socket-server'
import { Server as Socket } from 'socket.io'
import { PeerJsI } from '../peer-js-server'
import { ExpressPeerServer } from 'peer'


//Setting up Server
const app = express()
const httpServer = createServer(app)

// setting socketIo
new SocketI({server:httpServer,socket:Socket})

//setting up peer
const PeerInstance = new PeerJsI({expressI:httpServer,peerI:ExpressPeerServer})
app.use("/callRoom",PeerInstance.peerI)

export{
    httpServer
} 

