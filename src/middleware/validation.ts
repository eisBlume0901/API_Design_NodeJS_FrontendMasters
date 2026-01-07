import type { Request, Response, NextFunction} from "express"
import type { ZodSchema } from "zod"
import { z } from "zod"

// Example of higher order function because validateBody returns a middleware function
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // schema parse from Zod will validate the req.body
            // such as checking required fields and data types
            const validatedData = schema.parse(req.body)
            req.body = validatedData // Replace the body with the validated data
            next()
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res
                    .status(400)
                    .json({
                        error: "Something went wrong during request validation",
                        details: z.flattenError(e)
                    })
            }
            next(e) // Pass other errors to the error handling middleware
        }
    }
}

export const validateParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params)
            next()
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res
                    .status(400)
                    .json({
                        error: "Something went wrong during params validation",
                        details: z.flattenError(e)
                    })
            }
            next(e)
        }
    }
}

export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query)
            next()
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res
                    .status(400)
                    .json({
                        error: "Something went wrong during query validation",
                        detail: z.flattenError(e)
                    })
            }
        }
    }
}