import { Router } from "express"
import { validateBody, validateParams } from "../middleware/validation.ts"
import { z } from "zod"

const router = Router()

const createHabitSchema = z.object({
    name: z.string(),
})

const habitIdSchema = z.object({
    id: z.string().min(3).max(3),
})

router.get("/", (req, res) => {
    res.json({ message: "Here is your list of habits!" }).status(200)
})

router.get("/:id", validateParams(habitIdSchema), (req, res) => {
    res.json({ message: "Here is the specific habit details!"}).status(201)
})

// To test validateBody
// Go to Postman and do not include any name field in the raw JSON body
router.post("/", validateBody(createHabitSchema), (req, res) => {
    res.json({ message: "Created a new habit!"}).status(201)
})

router.delete("/:id", (req, res) => {
    res.status(200).json({ message: "Deleted a specific habit!"})
})

export default router

