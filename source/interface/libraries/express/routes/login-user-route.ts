import { Request, Response, Router } from "express";

export const LoginUserRoute = Router()

const LogUser=async(request:Request,response:Response)=>{
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

LoginUserRoute.post("/signIn",LogUser)
