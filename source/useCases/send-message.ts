import { prismaI } from "./contract/prisma";

export class RecordMessage{
    constructor(private prisma:prismaI){}
    async recordMessage(props:{username: string; roomId:string;userId: string; subRoomId: string; message: string}):Promise<void>{
        const message = await this.prisma.sendMessage(props) 

        //temporary
        console.log(message)

        return
    }
}