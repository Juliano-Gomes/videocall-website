import { Request, Response, Router } from "express";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import { CreateRoomUseCase } from "../../../../useCases/create-room-usecase";
import {z} from 'zod'

export const RoomRoute = Router()

const Room=async(request:Request,response:Response)=>{
    const RoomI = z.object({
        roomTitle: z.string(),
        owner: z.object({
            id: z.string()
        }),
        description: z.string()
    })
    try {
        const props = RoomI.parse({
            roomTitle:request.body.roomTitle,
            owner:{
                id:request.body.owner.id
            },
            description:request.body.description
        })
        const prismaI = new PrismaAdapter(prisma)
        const RoomRef = new CreateRoomUseCase(prismaI)
        const create = await RoomRef.create(props)

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

RoomRoute.post("/RegisterRoom",Room)
