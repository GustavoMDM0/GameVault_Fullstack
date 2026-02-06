"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: "#000",
        },
        fpsLimit: 60,

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab", 
            },
            onClick: {
              enable: true,
              mode: "push",
            },
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 1,
              },
            },
            push: {
              quantity: 3,
            },
          },
        },

        particles: {
          color: { value: "#ffffff" },

          links: {
            color: "#ffffff",
            distance: 130,
            enable: true,
            opacity: 0.4,
            width: 1,
          },

          move: {
            enable: true,
            speed: 0.8,
          },

          number: {
            value: 60,
            density: { enable: true, area: 800 },
          },

          opacity: {
            value: 0.5,
          },
          size: {
            value: { min: 1, max: 2 },
          },
        },

        detectRetina: true,
      }}
    />
  );
}
