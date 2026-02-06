"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiLogOut, FiEdit2, FiTrash2 } from "react-icons/fi";

type Game = {
  _id: string;
  title: string;
  genre?: string;
  platform?: string;
  releaseYear?: number;
  description?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const handleDelete = async (gameId: string) => {
    const confirmDelete = confirm("Tem certeza que deseja excluir este jogo?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/games/${gameId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Erro ao excluir o jogo.");
        return;
      }

      setGames((prev) => prev.filter((g) => g._id !== gameId));
    } catch {
      alert("Erro inesperado ao excluir.");
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_BASE}/games`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            return;
          }
          throw new Error("Erro ao buscar jogos");
        }

        const data = await res.json();
        setGames(data || []);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#262626] text-white">

      {/* HEADER responsivo */}
      <header className="
        w-full h-auto py-4 px-4 sm:px-8 
        flex flex-col sm:flex-row items-center sm:justify-between 
        gap-4 sm:gap-0
        bg-black/10 backdrop-blur-lg border-b border-white/10
      ">

        {/* Logo + título */}
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="logo"
            width={40}
            height={40}
            className="opacity-90"
          />

          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-100">
              GameVault
            </h1>
            <span className="text-xs sm:text-sm text-gray-400">
              — Meu Cofre
            </span>
          </div>
        </div>

        {/* Botões lado direito */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

          {/* Adicionar */}
          <button
            onClick={() => router.push("/game/adicionar")}
            className="px-4 py-2 rounded-md 
              bg-gradient-to-r from-[#2b2b2b] to-[#1a1a1a]
              border border-white/10
              text-gray-200 text-sm sm:text-base font-medium
              hover:scale-105 hover:brightness-110
              transition shadow-md"
          >
            + Adicionar
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-md
              bg-gradient-to-r from-[#1a0030] via-[#240046] to-[#001a3a]
              border border-white/10
              text-gray-200 text-sm sm:text-base font-medium
              shadow-[0_0_12px_rgba(60,0,120,0.3)]
              hover:shadow-[0_0_18px_rgba(60,0,120,0.5)]
              hover:scale-105 hover:brightness-110
              transition"
          >
            <FiLogOut size={18} />
            Sair
          </button>

        </div>
      </header>

      {/* CONTEÚDO */}
      <section className="p-4 sm:p-8 lg:p-12">

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-medium text-gray-200">
            Meus Jogos
          </h2>
          <span className="text-gray-400 text-sm">{games.length} jogos</span>
        </div>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && games.length === 0 && <p>Nenhum jogo adicionado.</p>}

        {/* Cards responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {games.map((g) => (
            <article
              key={g._id}
              className="
                bg-black/20 border border-white/10 rounded-xl 
                p-4 sm:p-5 backdrop-blur-md shadow-xl 
                hover:scale-[1.01] transition
              "
            >
              <h3 className="text-lg font-semibold text-gray-100">
                {g.title}
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                {g.platform} • {g.genre} • {g.releaseYear ?? "-"}
              </p>

              <p className="mt-4 text-sm text-gray-300 line-clamp-3">
                {g.description}
              </p>

              <div className="flex items-center gap-3 mt-5">

                {/* Editar */}
                <button
                  onClick={() => router.push(`/game/editar/${g._id}`)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md
                    bg-gradient-to-r from-[#2e2e2e] to-[#1c1c1c]
                    border border-white/10 text-gray-200 text-sm
                    hover:scale-105 transition"
                >
                  <FiEdit2 size={15} /> Editar
                </button>

                {/* Excluir */}
                <button
                  onClick={() => handleDelete(g._id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md
                    bg-gradient-to-r from-[#1a0030] via-[#240046] to-[#001a3a]
                    border border-white/10
                    text-gray-200 text-sm font-medium
                    shadow-[0_0_10px_rgba(60,0,120,0.3)]
                    hover:shadow-[0_0_15px_rgba(60,0,120,0.5)]
                    hover:scale-105 hover:brightness-110
                    transition"
                >
                  <FiTrash2 size={15} /> Excluir
                </button>

              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
