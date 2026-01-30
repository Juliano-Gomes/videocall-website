import { UserEntity } from "../domain/Entities/user";
import { prismaI } from "./contract/prisma";

export class CreateUserUseCase {
    constructor(private prisma:prismaI){}

    async create (props:{communitiesRooms?:{roomId:string,RoomTitle:string}[],username:string}):Promise<{message:string}>{
        // user exist
        const userId = crypto.randomUUID().toString()

        //apply business logic
        const User = new UserEntity({
            ...props,
            userId
        }).User

        const CadasterUser = await this.prisma.createUser(User)

        return CadasterUser
    }
}