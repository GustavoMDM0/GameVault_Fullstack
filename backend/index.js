import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./src/database/connection.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 3001;

const server = express();
server.use(cors());
server.use(bodyParser.json());

// Conectar ao MongoDB
connectDB();

server.use("/", app);

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
