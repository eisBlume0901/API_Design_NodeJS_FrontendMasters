// Purpose is runtime checking and schema validation in a Node.js application using TypeScript.
import { z } from "zod"

// Purpose is to load environment variables from a specific .env type (test, development, production)
import { env as loadEnv } from "custom-env"

// To ensure that APP_STAGE is set before loading the environment variables
process.env.APP_STAGE = process.env.APP_STAGE || "development" // dev since it is the common default (short for development)

const isProduction = process.env.APP_STAGE === "production"
const isDevelopment = process.env.APP_STAGE === "development"
const isTesting = process.env.APP_STAGE === "test"

if (isDevelopment) {
    loadEnv() // load default .env
} else if (isTesting) {
    loadEnv('test') // load .env.test
}

// Define the schema for environment variables
const envSchema = z.object({
    // Include what is expected in the environment variables
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    APP_STAGE: z
        .enum(["development", "test", "production"])
        .default("development"),

    // Coerce is type casting from string to number
    PORT: z.coerce.number().positive().default(3000),

    // DATABASE_URL: z.string().startsWith("postgresql://"),
    // DATABASE_POOL_MIN: z.coerce.number().positive().default(2),
    // DATABASE_POOL_MAX: z.coerce
    //     .number()
    //     .positive()
    //     .default(isProduction ? 50 : 10), // More connections in prod


    // JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    // JWT_EXPIRES_IN: z.string().default("7d"),

    BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),

    // CORS_ORIGIN: z
    //     .string()
    //     .or(z.array(z.string()))
    //     .transform((val) => {
    //         if (typeof val == "string") {
    //             return val.split(",").map(((origin) => origin.trim()))
    //         }
    //
    //         return val
    //     })
    //     .default([]),

    // LOG_LEVEL: z
    //     .enum(["error", "warn", "info", "debug"])
    //     .default(isProduction ? "info" : "debug")

    // RATE_LIMIT_WINDOW: z.coerce
    //     .number()
    //     .positive()
    //     .default(isProduction ? 900000 : 60000), // 15min prod, 1min dev
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
    env = envSchema.parse(process.env) // Validate and parse the environment variables in .env
} catch (e) {
    if (e instanceof z.ZodError) {
        console.log("Invalid environment variables")
        console.error(z.prettifyError(e))

        process.exit(1) // Exit 1 indicates failure
    }
    throw e
}


// Exporting the validated environment variables so that they can be used throughout the application
export const isProd = () => env.APP_STAGE === "production"
export const isDev = () => env.APP_STAGE === "development"
export const isTest = () => env.APP_STAGE === "test"


export { env }
export default env