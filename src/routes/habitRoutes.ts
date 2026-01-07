import { Router } from "express"
import { validateBody } from "../middleware/validation.ts"
import { z } from "zod"

const router = Router()

const createHabitSchema = z.object({
    name: z.string(),

})
router.get("/", (req, res) => {
    res.json({ message: "Here is your list of habits!" }).status(200)
})

router.get("/:id", (req, res) => {
    res.json({ message: "Here is the specific habit details!"}).status(201)
})

// To test validateBody
// Go to Postman and do not include any name field in the raw JSON body
router.post("/", validateBody(createHabitSchema), (req, res) => {
    res.json({ message: "Created a new habit!"}).status(201)
})

router.delete("/:id", (req, res) => {
    res.json({ message: "Deleted your habit"}).status(201)
})

export default router

