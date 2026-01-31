import { Request, Response, Router } from "express";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import {z} from 'zod'
import { CreateSubRoomUseCase } from "../../../../useCases/create-sub-room-usecase";

export const SubRoomRoute = Router()

const SubRoom=async(request:Request,response:Response)=>{
    const subRoomI = z.object({
        roomId: z.string(), subRoomName: z.string(), subRoomType: z.enum(["call" , "message" , "announcements" , "private"])
    })
    try {
        const props = subRoomI.parse(request.body)
        const prismaI = new PrismaAdapter(prisma)
        const subI = new CreateSubRoomUseCase(prismaI)
        const create = await subI.room(props)

        response.status(201).json(create)
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

SubRoomRoute.post("/createSubRoom",SubRoom)
