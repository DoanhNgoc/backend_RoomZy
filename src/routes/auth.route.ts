import { Router } from "express";
import {
    signup,
    login,
    forgotPassword,
    editProfile,
} from "../services/auth.services";

const router = Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const data = await signup(req.body);
        res.json(data);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await login(email, password);

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            data: user,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const data = await forgotPassword(email);
        res.json(data);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// Edit profile
router.put("/edit/:id", async (req, res) => {
    try {
        const data = await editProfile(req.params.id, req.body);
        res.json(data);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;