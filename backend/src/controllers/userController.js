import User from "../models/userModels.js";
import { Game } from "../models/gameModels.js";
import { getBestDealByTitle } from "../services/cheapSharkService.js";
import jwt from "jsonwebtoken";

/* =========================
   JWT
========================= */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

/* =========================
   REGISTER
========================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao registrar usuário",
      error: error.message
    });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao fazer login",
      error: error.message
    });
  }
};

/* =========================
   GET NOTIFICATIONS
========================= */
export const getUserNotifications = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user.notifications || []);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar notificações",
      error: error.message
    });
  }
};

/* =========================
   CHECK DEALS & CREATE NOTIFICATIONS
========================= */
export const checkUserGameDeals = async (req, res) => {
  try {
    const user = req.user;

    // 1. Buscar jogos do usuário
    const games = await Game.find({ user: user._id });

    if (!games.length) {
      return res.status(200).json({
        message: "Usuário não possui jogos cadastrados"
      });
    }

    const notificationsCreated = [];

    // 2. Para cada jogo (APENAS PC)
    for (const game of games) {

      if (game.platform !== "PC") {
        continue;
      }

      const deal = await getBestDealByTitle(game.title);

      if (!deal) {
        continue;
      }

      // 3. Evitar notificações duplicadas (por dealId)
      const alreadyNotified = user.notifications?.some(
        (n) => n.dealId === deal.dealId
      );

      if (alreadyNotified) {
        continue;
      }

      notificationsCreated.push({
        gameId: game._id,
        dealId: deal.dealId,

        title: "Jogo em promoção 🎮",

        message: `${deal.gameTitle} está em promoção na ${deal.store}
De $${deal.normalPrice} por $${deal.salePrice} (${Math.round(deal.savings)}% OFF)`,

        store: deal.store,
        salePrice: Number(deal.salePrice),
        normalPrice: Number(deal.normalPrice),
        savings: Number(deal.savings),

        link: deal.redirectUrl,
        read: false,
        createdAt: new Date()
      });
    }

    // 4. Salvar notificações
    if (notificationsCreated.length > 0) {
      user.notifications = user.notifications || [];
      user.notifications.push(...notificationsCreated);
      await user.save();
    }

    return res.status(200).json({
      message: "Verificação de promoções concluída",
      notificationsCreated
    });

  } catch (error) {
    console.error("Erro ao verificar promoções:", error);
    return res.status(500).json({
      message: "Erro ao verificar promoções",
      error: error.message
    });
  }
};
