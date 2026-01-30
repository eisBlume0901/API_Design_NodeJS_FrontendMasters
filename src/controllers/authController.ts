import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import { db } from "../db/connection.ts"
import { users } from "../db/schema.ts"


export const register = (req: Request, res: Response) => {
    try
    {


    } catch (e)
    {
        console.error("Registration Error", e)
        res.status(500)
            .json({
                message: "Interval Server Error",
                error: "Failed to create user"
            })
    }
}