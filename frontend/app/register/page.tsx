"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiMail, FiUser, FiLock } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: "Erro ao registrar" }));
        throw new Error(body.message || "Erro ao registrar");
      }

      // login automático após registrar
      await login(email, password);
      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message || "Erro ao registrar");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-gradient-to-r from-black via-[#240035] to-[#003b88]">

      {/* painel esquerdo */}
      <div className="
    w-full lg:w-[32%]
    backdrop-blur-xl bg-white/5 border-r border-white/10
    flex items-center justify-center p-8
  ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm text-white"
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 justify-center lg:justify-start">
            <span className="text-white">Criar Conta</span>
            <span className="text-blue-400 text-4xl">
              <img src="../favicon.ico" className="w-12 h-12" />
            </span>
          </h1>

          {error && (
            <p className="text-red-400 mb-4 text-center lg:text-left">{error}</p>
          )}

          <div className="mb-4 relative">
            <FiUser className="absolute left-3 top-3 text-gray-300" />
            <input
              type="text"
              placeholder="Nome"
              className="w-full p-3 pl-10 rounded bg-white/10 border border-white/20 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 relative">
            <FiMail className="absolute left-3 top-3 text-gray-300" />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 pl-10 rounded bg-white/10 border border-white/20 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6 relative">
            <FiLock className="absolute left-3 top-3 text-gray-300" />
            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 pl-10 rounded bg-white/10 border border-white/20 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Criando..." : "Registrar"}
          </button>

          <p className="mt-4 text-sm text-gray-300 text-center">
            Já tem conta?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Entrar
            </a>
          </p>
        </form>
      </div>

      {/* lado direito - some no mobile */}
      <div className="hidden lg:flex flex-1"></div>
    </main>
  );
}
