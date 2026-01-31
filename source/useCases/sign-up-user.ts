import { prismaI } from "./contract/prisma";

export class SignUpUserUseCase{
    constructor(private prisma:prismaI){}
    async sign(props:{username:string,userUniqueKey:string}):Promise<{User:any}>{
        const Response = await this.prisma.LoginUser(props)

        return Response
    }
}