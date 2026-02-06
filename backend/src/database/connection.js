import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Tenta ler do .env. Se não existir, usa o localhost como reserva.
    const url = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gamevault";
    
    await mongoose.connect(url);
    console.log("✅ MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1); // Fecha o app se não conseguir conectar ao banco
  }
};