import { httpServer } from "./interface/libraries/express"

// putting the server to listen
const PortOfServer = process.env.ServerPort || 5000 

httpServer.listen(PortOfServer,()=>{
    console.log(`Server Is Running on Port ${PortOfServer}`)
})