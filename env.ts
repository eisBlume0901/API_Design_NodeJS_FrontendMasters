// Purpose is runtime checking and schema validation in a Node.js application using TypeScript.
import { z } from "zod"

// Purpose is to load environment variables from a specific .env type (test, development, production)
import { env as loadEnv } from "custom-env"

// To ensure that APP_STAGE is set before loading the environment variables
process.env.APP_STAGE = process.env.APP_STAGE || "dev" // dev since it is the common default (short for development)

const isProduction = process.env.APP_STAGE === "production"
const isDevelopment = process.env.APP_STAGE === "development"
const isTest = process.env.APP_STAGE === "test"

if (isDevelopment) {
    loadEnv() // load default .env
} else if (isTest) {
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

    DATABASE_URL: z.string().startsWith("postgresql://"),
    DATABASE_POOL_MIN: z.coerce.number().positive().default(2),
    DATABASE_POOL_MAX: z.coerce.number().positive().default(10),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    JWT_EXPIRES_IN: z.string().default("7d"),

    BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
    env = envSchema.parse(process.env) // Validate and parse the environment variables in .env
} catch (e) {
    if (e instanceof z.ZodError) {
        console.log("Invalid environment variables")
        console.error(z.prettifyError(e))
    }
}