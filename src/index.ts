import express from "express";
import "dotenv/config";
import cors from "cors";
import statusRoutes from "./routes/status.route";
import authRouter from "./routes/auth.route"
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes


//status
app.use("/api/status", statusRoutes);
//auth login, signup, forgotpassword and degisn profile
app.use("api/auth", authRouter)
// test alive
app.get("/", (_req, res) => {
    res.send("API running...");
});

const PORT = process.env.PORT || 3000;
app.listen(3000, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
}); 