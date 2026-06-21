"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface CityNode {
      x: number;
      y: number;
      name: string;
      radius: number;
      pulse: number;
      pulseDirection: number;
    }

    const cityNames = [
      "Lucknow", "Delhi", "Agra", "Dehradun", "Jaipur", 
      "Paris", "Tokyo", "New York", "Reykjavik", "Bali"
    ];
    const cities: CityNode[] = [];

    for (let i = 0; i < cityNames.length; i++) {
      cities.push({
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 200) + 100,
        name: cityNames[i],
        radius: Math.random() * 3 + 2.5,
        pulse: Math.random() * 2 + 1,
        pulseDirection: Math.random() > 0.5 ? 0.04 : -0.04,
      });
    }

    interface RouteEdge {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
    }

    const routes: RouteEdge[] = [];
    for (let i = 0; i < cities.length; i++) {
      const numConnections = Math.floor(Math.random() * 2) + 1;
      for (let c = 0; c < numConnections; c++) {
        const target = Math.floor(Math.random() * cities.length);
        if (target !== i) {
          routes.push({
            fromIndex: i,
            toIndex: target,
            progress: Math.random(),
            speed: Math.random() * 0.002 + 0.001,
          });
        }
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cities.forEach((city) => {
        city.x = Math.random() * (width - 200) + 100;
        city.y = Math.random() * (height - 200) + 100;
      });
    };

    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const lineColor = isDark ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.07)";
      const signalColor = isDark ? "rgba(139, 92, 246, 0.7)" : "rgba(139, 92, 246, 0.5)";
      const cityColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.12)";
      const nameColor = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.2)";

      // Draw route pathways
      ctx.lineWidth = 1;
      routes.forEach((route) => {
        const from = cities[route.fromIndex];
        const to = cities[route.toIndex];
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Draw moving signals
      routes.forEach((route) => {
        const from = cities[route.fromIndex];
        const to = cities[route.toIndex];

        route.progress += route.speed;
        if (route.progress > 1.0) {
          route.progress = 0;
          route.toIndex = Math.floor(Math.random() * cities.length);
        }

        const currentX = from.x + (to.x - from.x) * route.progress;
        const currentY = from.y + (to.y - from.y) * route.progress;

        ctx.fillStyle = signalColor;
        ctx.shadowColor = signalColor;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw cities
      cities.forEach((city) => {
        city.pulse += city.pulseDirection;
        if (city.pulse > 3.5 || city.pulse < 1) {
          city.pulseDirection *= -1;
        }

        ctx.fillStyle = cityColor;
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.radius + city.pulse * 2.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = nameColor;
        ctx.font = "9px Outfit, Inter, sans-serif";
        ctx.fillText(city.name, city.x + 8, city.y + 3);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />;
}
