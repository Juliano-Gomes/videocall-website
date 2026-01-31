import { Request, Response, Router } from "express";

export const RoomRoute = Router()

const Room=async(request:Request,response:Response)=>{
    try {
        
    } catch (error:any) {
        console.log({
            reason:error.cause,
            file:error.where || null
        })

        response.status(500).json({
            message:error.message,
            name:error.name
        })
    }
}

RoomRoute.post("/RegisterRoom",Room)
