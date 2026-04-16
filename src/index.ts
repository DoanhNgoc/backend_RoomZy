import express from "express";
import "dotenv/config";
import cors from "cors";

//import router
import statusRoutes from "./routes/status.route";
import authRouter from "./routes/auth.route";
import roleRouter from "./routes/roles.route";
import boardingHouseRouter from "./routes/boardingHouse.route"
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes


//status
app.use("/api/status", statusRoutes);
//auth login, signup, forgotpassword and degisn profile
app.use("/api/auth", authRouter)
//roles
app.use("/api/roles", roleRouter)
//boarding house
app.use("/api/boardingHouse", boardingHouseRouter)
// test alive
app.get("/", (_req, res) => {
    res.send("API running backend flutter...");
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

