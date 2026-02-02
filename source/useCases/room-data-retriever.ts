import { prismaI } from "./contract/prisma";

export class RoomDataRetrieverUseCase {
    constructor(private prismaI:prismaI){}

    async retrieve(props:{roomId:string}):Promise<{roomInfo: any;}>{
        const response = await this.prismaI.retrieve(props)

        return response
    }
}