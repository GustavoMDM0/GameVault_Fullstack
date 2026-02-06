import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import gameRoutes from "./routes/gameRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas principais
app.use("/api", gameRoutes);
app.use("/api/users", userRoutes);

export default app;
