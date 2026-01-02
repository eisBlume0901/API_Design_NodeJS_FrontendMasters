import { Router } from "express"

const router = Router()

router.post("/register", (req, res) => {
    res.status(201).json({ message: "you created an account successfully"})
})


router.post("/login", (req, res) => {
    res.status(200).json({ message: "you have logged in successfully"})
})


export default router