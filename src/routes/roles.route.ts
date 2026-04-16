import { Router } from "express";
import { getAllRoles } from "../services/role.services";


const router = Router();
router.get("/", async (_req, res) => {
    try {
        const data = await getAllRoles()
        res.json({ success: true, data })
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message })
    }
})
export default router