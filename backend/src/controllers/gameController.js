import { Game } from "../models/gameModels.js";
import { getBestDealByTitle } from "../services/cheapSharkService.js";


// Listar todos os jogos (associa ao usuário logado)
export const getAllGames = async (req, res) => {
  try {
    const userId = req.user.id;
    const games = await Game.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(games);
  } catch (error) {
    console.error("Erro em getAllGames:", error);
    return res.status(500).json({ message: "Erro ao buscar jogos", error: error.message });
  }
};

// Buscar um jogo por ID (associa ao usuário logado)
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Jogo não encontrado" });

    if (game.user.toString() !== userId) {
      return res.status(403).json({ message: "Acesso negado: este jogo não pertence ao usuário" });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error("Erro em getGameById:", error);
    return res.status(500).json({ message: "Erro ao buscar jogo", error: error.message });
  }
};

// Criar novo jogo (associa ao usuário logado)
export const createGame = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, genre, platform, releaseYear, description } = req.body;

    // validação
    if (!title || !genre || !platform) {
      return res.status(400).json({ message: "Campos obrigatórios: title, genre, platform" });
    }

    const newGame = new Game({
      title,
      genre,
      platform,
      releaseYear,
      description,
      user: userId
    });

    await newGame.save();
    return res.status(201).json(newGame);
  } catch (error) {
    console.error("Erro em createGame:", error);
    return res.status(500).json({ message: "Erro ao criar jogo", error: error.message });
  }
};

// Atualizar jogo (associa ao usuário logado)
export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Jogo não encontrado" });

    if (game.user.toString() !== userId) {
      return res.status(403).json({ message: "Acesso negado: não é proprietário do jogo" });
    }

    // Atualiza somente os campos permitidos
    const updates = (({ title, genre, platform, releaseYear, description }) => ({ title, genre, platform, releaseYear, description }))(req.body);

    const updatedGame = await Game.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Erro em updateGame:", error);
    return res.status(500).json({ message: "Erro ao atualizar jogo", error: error.message });
  }
};

// Deletar jogo (associa ao usuário logado)
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Jogo não encontrado" });

    if (game.user.toString() !== userId) {
      return res.status(403).json({ message: "Acesso negado: não é proprietário do jogo" });
    }

    await Game.findByIdAndDelete(id);
    return res.status(200).json({ message: "Jogo deletado com sucesso" });
  } catch (error) {
    console.error("Erro em deleteGame:", error);
    return res.status(500).json({ message: "Erro ao deletar jogo", error: error.message });
  }
};

export const searchGameDeals = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Título do jogo é obrigatório" });
    }

    const deals = await getBestDealByTitle(title);

    res.status(200).json(deals);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao buscar promoções",
      error: error.message
    });
  }
};