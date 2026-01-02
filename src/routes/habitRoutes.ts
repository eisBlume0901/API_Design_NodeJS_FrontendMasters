import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.json({ message: "Here is your list of habits!" }).status(200)
})

router.get("/:id", (req, res) => {
    res.json({ message: "Here is the specific habit details!"}).status(201)
})

router.post("/", (req, res) => {
    res.json({ message: "Created a new habit!"}).status(201)
})

router.delete("/:id", (req, res) => {
    res.json({ message: "Deleted your habit"}).status(201)
})

export default router

