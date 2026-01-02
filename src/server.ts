import  express from "express"

import authRoutes from "./routes/authRoutes.ts";
import habitRoutes from "./routes/habitRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = express()

// Any incoming request that are gibberish or do not match defined routes
// will be caught by this middleware and return a 404 Not Found response
app.use("/*", (req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    })
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Habit Tracker API",
    })
})

// Decoupled routes - imported from separate modules (useful for larger applications because
// it keeps the main server file clean and organized)
// Decoupled means that the route definitions are not tied directly to the main server file
app.use("/auth", authRoutes)
app.use("/habits", habitRoutes)
app.use("/users", userRoutes)

// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app