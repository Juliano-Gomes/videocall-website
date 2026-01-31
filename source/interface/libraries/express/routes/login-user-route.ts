import { Request, Response, Router } from "express";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import {z} from 'zod'
import { SignUpUserUseCase } from "../../../../useCases/sign-up-user";

export const LoginUserRoute = Router()

const LogUser=async(request:Request,response:Response)=>{
    const LogI = z.object({
        username:z.string(),
        userUniqueKey:z.string()
    })
    try {
        const props = LogI.parse(request.body)
        const prismaI = new PrismaAdapter(prisma)
        const log = new SignUpUserUseCase(prismaI)
        const logI = await log.sign(props)

        response.status(200).json(logI)
        
    } catch (error:any) {
        const code = error.statusCode || 500
        const message= error.message || "unknown error dev already notified!"
        const name = error.name || "Unknown error"
        console.log({
            reason:error.cause,
            file:error.where || null
        })

        response.status(code).json({
            message,
            name
        })
    }
}

LoginUserRoute.post("/signIn",LogUser)
