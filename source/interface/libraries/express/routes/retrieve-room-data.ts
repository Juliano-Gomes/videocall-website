import { Request, Response, Router } from "express";
import { z,ZodError } from "zod";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import { RoomDataRetrieverUseCase } from "../../../../useCases/room-data-retriever";

export const RoomRetrievedData = Router()
const RoomDataHandler = async (request:Request,response:Response)=>{
    const params = z.object({roomId:z.string()})
    try {
        const props= params.parse({roomId:request.params.roomId})
        const prismaI = new PrismaAdapter(prisma)
        // useCase => Retrieve data 
        const resultI = new RoomDataRetrieverUseCase(prismaI)
        const RoomInfo = await resultI.retrieve(props)

        response.status(200).json(RoomInfo)
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

RoomRetrievedData.get("/Room/info/:roomId",RoomDataHandler)