import { Request, Response, Router } from "express";
import {z, ZodError} from 'zod'
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import { SearchRoomUseCase } from "../../../../useCases/search-room-by-name";

export const SearchRoomRoute = Router()

const SearchRouteHandler = async (request:Request,response:Response)=>{
    const params = z.object({
        room:z.string()
    })

    try {
        const {room} = params.parse({
            room:request.params.room
        })
        const prismaI = new PrismaAdapter(prisma)
        const searcher = new SearchRoomUseCase(prismaI)
        const results = await searcher.search({
            name:room
        })

        response.status(200).json(results)
        
    } catch (error:any) {
        if(error instanceof ZodError){
            response.status(403).json({
                message:"Invalid data",
                name:"Invalid data error"
            })
        }else{
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
}

SearchRoomRoute.get("/search/:room",SearchRouteHandler)