import { Router } from "express";
import {
    createStatus,
    getAllStatus,
    getStatusById,
    updateStatus,
    deleteStatus,
} from "../services/status.service";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
    try {
        const data = await createStatus(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// GET ALL
router.get("/", async (_req, res) => {
    try {
        const data = await getAllStatus();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// GET BY ID
router.get("/:id", async (req, res) => {
    try {
        const data = await getStatusById(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const data = await updateStatus(req.params.id, req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const data = await deleteStatus(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;