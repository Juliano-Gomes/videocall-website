import type { ExpressPeerServer } from "peer";
import type { Server } from 'http'

export class PeerJsI {
    constructor(private props:{
        peerI:typeof ExpressPeerServer,
        expressI :  Server
    }){
        const peer = this.props.peerI(this.props.expressI,{
            corsOptions:{
                origin : "*" //"http://localhost:3000"
            }
        })

        peer.on("connection",peerI=>{
            console.log(`new peer Joined with Id : ${peerI.getId()}`)
        })
    }

    get peerI(){
        return this.props.peerI
    }
}