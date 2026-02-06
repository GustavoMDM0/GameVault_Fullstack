"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "../components/ParticlesBackground";
import Image from "next/image";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Fundo de partículas */}
      <ParticlesBackground />

      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-4 sm:px-10 py-4 sm:py-6 z-20">

        {/* LOGO */}
        <div
          className="cursor-pointer hover:scale-110 transition">
          <Image
            src="/favgv.png"
            alt="Logo GameVault"
            width={50}
            height={50}
            priority
          />
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden sm:flex gap-4 md:gap-6">
          <button className="hover-btn" onClick={() => router.push("/login")}>
            <svg width="140px" height="40px" viewBox="0 0 180 60">
              <polyline points="179,1 179,59 1,59 1,1 179,1"></polyline>
            </svg>
            <span>Login</span>
          </button>

          <button className="hover-btn" onClick={() => router.push("/register")}>
            <svg width="140px" height="40px" viewBox="0 0 180 60">
              <polyline points="179,1 179,59 1,59 1,1 179,1"></polyline>
            </svg>
            <span>Registrar</span>
          </button>
        </nav>

        {/* MENU MOBILE BUTTON */}
        <button
          className="sm:hidden text-[#7a00ff] text-3xl font-bold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* MENU MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="sm:hidden absolute top-20 right-4 bg-black/80 backdrop-blur-md border border-[#7a00ff]/40 rounded-xl px-6 py-4 flex flex-col gap-4 z-30 shadow-[0_0_15px_rgba(122,0,255,0.7)]">

          <button
            className="hover-btn w-full text-center"
            onClick={() => router.push("/login")}
          >
            <svg width="140px" height="40px" viewBox="0 0 180 60">
              <polyline points="179,1 179,59 1,59 1,1 179,1"></polyline>
            </svg>
            <span>Login</span>
          </button>

          <button
            className="hover-btn w-full text-center"
            onClick={() => router.push("/register")}
          >
            <svg width="140px" height="40px" viewBox="0 0 180 60">
              <polyline points="179,1 179,59 1,59 1,1 179,1"></polyline>
            </svg>
            <span>Registrar</span>
          </button>
        </div>
      )}

      {/* CONTEÚDO CENTRAL */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">

        {/* TÍTULO */}
        <h1 className="text-white font-extrabold text-4xl sm:text-6xl md:text-7xl drop-shadow-[0_0_25px_rgba(122,0,255,0.7)] animate-pulse">
          GameVault
        </h1>

        {/* SUBTÍTULO */}
        <p className="text-gray-300 mt-4 text-base sm:text-lg md:text-xl max-w-xl leading-relaxed">
          Seu cofre digital gamer — acompanhe promoções, organize sua coleção
          e desbloqueie tudo em um só lugar.
        </p>

        {/* BOTÕES CENTRAIS */}
        <div className="flex flex-col items-center gap-6 mt-16">

          <button className="btn-center" onClick={() => router.push("/login")}>
            Começar Agora
          </button>

          <button className="btn-center" onClick={() => router.push("/login")}>
            Explorar o GameVault
          </button>

        </div>

        {/* Linha decorativa */}
        <div className="w-32 sm:w-40 h-[2px] bg-[#7a00ff]/40 mt-12 shadow-[0_0_15px_rgba(122,0,255,0.7)]"></div>

      </div>
    </main>
  );
}
