import { Request, Response, Router } from "express";
import { PrismaAdapter } from "../../../prisma";
import { prisma } from "../../../../../lib/prisma";
import {z} from 'zod'
import { TurnUserAdministrator } from "../../../../useCases/add-user-to-admins";

export const TurnUserAdminRoute = Router()

const TurnUserAdmin=async(request:Request,response:Response)=>{
    const admin = z.object({ 
        newSuperUser: z.object({ roomId: z.string() ,name: z.string(), id: z.string() }),
        administrator: z.object({ roomId: z.string() ,name: z.string(), id: z.string() }), 
        roomId: z.string() 
    })
    try {
        const props = admin.parse({
            newSuperUser: { roomId: request.body.newSuperUser.roomId,name: request.body.newSuperUser.name, id: request.body.newSuperUser.id},
            administrator: { roomId: request.body.administrator.roomId ,name: request.body.administrator.name, id: request.body.administrator.id }, 
            roomId: request.body.roomId 
        })
        const prismaI = new PrismaAdapter(prisma)
        const addI = new TurnUserAdministrator(prismaI)
        const sudo = addI.sudo(props)
        
        response.status(200).json(sudo)
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

TurnUserAdminRoute.post("/sudoers",TurnUserAdmin)
