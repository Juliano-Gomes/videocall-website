import { Request, Response, Router } from "express";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import {z} from 'zod'
import { AddUserTORoomUseCase } from "../../../../useCases/add-user-by-link";

export const EnterRoomRoute = Router()

const EnterRoom=async(request:Request,response:Response)=>{
    const EnterI = z.object({ userId: z.string() ,username: z.string(), roomId: z.string() ,link: z.string() })
    try {
        const props = EnterI.parse(request.body)
        const prismaI = new PrismaAdapter(prisma)
        const enter = new AddUserTORoomUseCase(prismaI)
        const enterI = await enter.add(props)

        response.status(200).json(enterI)
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

EnterRoomRoute.post("/invitation",EnterRoom)
