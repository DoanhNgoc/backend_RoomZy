import { Router } from "express";
import { messaging } from "firebase-admin";
import { createdBoardingHouse, updateBoardingHouse } from "../services/boardingHouse.service";


const router = Router()


//tao day tro 
router.post("/create", async (req, res) => {
    try {
        const result = await createdBoardingHouse(req.body)
        return res.status(200).json({
            message: "Create department success",
            data: result,
        });
    } catch (error: any) {
        console.log("create false")
        res.status(400).json({ message: error.message })
    }
})
router.put("/update/:id", async (req, res) => {
    try {
        const DataUpdate = await updateBoardingHouse(req.params.id, req.body)
        res.json(
            {
                success: DataUpdate
            }
        )
    } catch (error: any) {
        res.status(400).json({
            update: false,
            messaging: "update boardign house unsuccess"
        })
    }
})
export default router