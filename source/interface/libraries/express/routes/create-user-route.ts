import { Request, Response, Router } from "express";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import {z, ZodError} from 'zod'
import { CreateUserUseCase } from "../../../../useCases/create-user";

export const UserRoute = Router()

const User=async(request:Request,response:Response)=>{
    const UserI = z.object({
        communitiesRooms :z.array(z.object({roomId:z.string(),RoomTitle:z.string()})).optional(),
        username:z.string()
    })
    try {
        const props = UserI.parse({
            username:request.body.username,
            communitiesRooms:request.body.communitiesRooms
        })
        const prismaI = new PrismaAdapter(prisma)
        const userI = new CreateUserUseCase(prismaI)
        const create = await userI.create(props)

        response.status(201).json(create)
        
    } catch (error:any) {
        if(error instanceof ZodError){
                    response.status(403).json({
                        message:"Invalid data",
                        name:"Invalid data error"
                    })
                }
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

UserRoute.post("/signUp",User)
