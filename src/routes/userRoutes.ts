import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.json({ message: "Getting all the users"}).status(200)
})

router.get("/:id", (req, res) => {
    res.json({ message: "Getting a specific user"}).status(200)
})

router.put("/id", (req, res) => {
    res.json({ message: "Updated a specific user"}).status(201)
})

router.delete("/:id", (req, res) => {
    res.json({message: "Delete a specific user"}).status(201)
})

export default router