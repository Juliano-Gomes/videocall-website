import { prismaI } from "./contract/prisma";


export class SearchRoomUseCase{
    constructor(private prisma:prismaI){}
    async search(props:{name:string}):Promise<{rooms:{roomId:string,roomTitle:string,members:number,room_link:string,createdAt:string}[]}>{
        const response = await this.prisma.searchRoom(props)

        return response
    }
}