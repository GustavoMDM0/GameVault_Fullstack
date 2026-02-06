import express from "express";
import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  searchGameDeals 
} from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas essas rotas exigem autenticação (cofre pessoal)
router.get("/games", protect, getAllGames);
router.get("/games/:id", protect, getGameById);
router.post("/games", protect, createGame);
router.put("/games/:id", protect, updateGame);
router.delete("/games/:id", protect, deleteGame);
router.get("/search", protect, searchGameDeals);

export default router;
