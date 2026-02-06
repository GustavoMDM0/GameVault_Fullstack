"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditGamePage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();

  const gameId = params.id;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const genres = [
    "Ação", "Aventura", "RPG", "FPS", "Terror", "Corrida",
    "Esportes", "Luta", "Puzzle", "Sandbox", "Mundo Aberto",
  ];
  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
  const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchGame() {
      try {
        const res = await fetch(`${API_BASE}/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Erro ao carregar jogo");
        }

        const g = await res.json();
        setTitle(g.title || "");
        setGenre(g.genre || "");
        setPlatform(g.platform || "");
        setReleaseYear(g.releaseYear ?? "");
        setDescription(g.description || "");
      } catch (err: any) {
        alert(err.message || "Erro ao carregar jogo");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
    //
  }, [gameId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedGame = {
      title,
      genre,
      platform,
      releaseYear: Number(releaseYear),
      description,
    };

    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGame),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Erro ao atualizar jogo");
      }

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar jogo");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#262626] text-white flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#262626] text-white p-6">
      <div className="max-w-2xl mx-auto bg-black/20 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-100">Editar Jogo</h1>
            <p className="text-sm text-gray-400">Atualize os dados do jogo.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título do jogo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#240046]/30 transition"
          />

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#240046]/30 transition"
          >
            <option value="">Selecione o gênero</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#240046]/30 transition"
          >
            <option value="">Selecione a plataforma</option>
            {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <select
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#240046]/30 transition"
          >
            <option value="">Ano de lançamento</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 h-28 focus:outline-none focus:ring-2 focus:ring-[#240046]/30 transition resize-none"
          />

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="
                w-full px-4 py-2 rounded-md
                bg-gradient-to-r from-[#1a0030] via-[#240046] to-[#001a3a]
                border border-white/10
                text-gray-200 text-sm font-medium
                shadow-[0_0_12px_rgba(60,0,120,0.3)]
                hover:shadow-[0_0_18px_rgba(60,0,120,0.5)]
                hover:scale-105 hover:brightness-110
                transition
              "
            >
              Salvar alterações
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-3 rounded-md bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
