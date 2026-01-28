import  express from "express"

import authRoutes from "./routes/authRoutes.ts"
import habitRoutes from "./routes/habitRoutes.ts"
import userRoutes from "./routes/userRoutes.ts"

import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"
import {isTest} from "../env.ts";

const app = express()

app.use(helmet())
app.use(cors())
// Built-in middleware to parse JSON request bodies (it is not the same as JSON.stringify
// where you convert an object to a JSON string - here we parse incoming JSON strings to JS objects)
app.use(express.json())
// Built-in middleware to parse URL-encoded request bodies (most common
// from HTML forms
// extended is set to true to support rich objects and arrays encoded into the URL-encoded format)
app.use(express.urlencoded({ extended: true }))
// Morgan middleware will only log requests in non-test environments such as development and production
// SHOULD USE THE WORD "dev" (not development which is the same with .env APP_STAGE value)
// INSTEAD OF "combined" FOR MORE VERBOSE LOGGING DURING DEVELOPMENT
// LOG is found IN THE CONSOLE
app.use(morgan('dev', {
    skip: () => isTest()
}))


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Habit Tracker API",
    })
})

// Decoupled routes - imported from separate modules (useful for larger applications because
// it keeps the mai     n server file clean and organized)
// Decoupled means that the route definitions are not tied directly to the main server file
app.use("/auth", authRoutes)
app.use("/habits", habitRoutes)
app.use("/users", userRoutes)

// SHOULD BE LAST ROUTE DEFINED IN THE FILE
// Any incoming request that are gibberish or do not match defined routes
// will be caught by this middleware and return a 404 Not Found response
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    })
})

// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app