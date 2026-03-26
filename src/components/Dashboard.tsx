"use client";

/**
 * Dashboard Component
 * Main dashboard that displays all sensors and their data
 */

import { useEffect } from "react";
import { useState } from "react";
import { useSensorContext } from "@/context/SensorContext";
import { MOCK_SENSORS, getRandomSensorUpdate } from "@/utils/mockData";
import { SensorCard } from "./SensorCard";
import { SensorChart } from "./SensorChart";
import { Wifi, WifiOff, RefreshCw, Sun, MoonStar } from "lucide-react";
import type { Sensor } from "@/types/sensor";

export const Dashboard: React.FC = () => {
  const { state, setSensors, updateSensorReading } = useSensorContext();
  const sensors: Sensor[] = Array.from(state.sensors.values());
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const savedTheme = localStorage.getItem("iot-dashboard-theme");
    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("iot-dashboard-theme", theme);
  }, [theme]);

  // Initialize sensors on component mount
  useEffect(() => {
    setSensors(MOCK_SENSORS);
  }, [setSensors]);

  // Simulate WebSocket data with mock data
  useEffect(() => {
    const interval = setInterval(() => {
      const update = getRandomSensorUpdate();
      updateSensorReading(update);
    }, 3000);

    return () => clearInterval(interval);
  }, [updateSensorReading]);

  const handleRefresh = () => {
    setSensors(MOCK_SENSORS);
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const onlineSensorCount = sensors.filter(
    (s: Sensor) => s.status === "online",
  ).length;
  const offlineSensorCount = sensors.filter(
    (s: Sensor) => s.status === "offline",
  ).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--surface-strong)]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] fade-in-up">
                IoT Dashboard
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Monitoramento de Sensores em Tempo Real
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="surface-strong lift-hover flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[var(--text-primary)]"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 text-[var(--accent)]" />
                    Tema Claro
                  </>
                ) : (
                  <>
                    <MoonStar className="w-4 h-4 text-[var(--accent)]" />
                    Tema Escuro
                  </>
                )}
              </button>
              <button
                onClick={handleRefresh}
                className="lift-hover flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-semibold hover:brightness-110"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass lift-hover rounded-2xl p-5 flex items-center gap-3 fade-in-up">
            <div className="p-3 bg-emerald-500/15 rounded-full border border-emerald-500/35">
              <Wifi className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">
                Sensores Online
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {onlineSensorCount}
              </p>
            </div>
          </div>

          <div className="glass lift-hover rounded-2xl p-5 flex items-center gap-3 fade-in-up">
            <div className="p-3 bg-rose-500/15 rounded-full border border-rose-500/35">
              <WifiOff className="text-rose-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">
                Sensores Offline
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {offlineSensorCount}
              </p>
            </div>
          </div>

          <div className="glass lift-hover rounded-2xl p-5 flex items-center gap-3 fade-in-up">
            <div className="p-3 bg-amber-500/15 rounded-full border border-amber-500/35">
              <span className="text-amber-300 text-lg font-bold">ID</span>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-sm">
                Total de Sensores
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {sensors.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
          Sensores Ativos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor: Sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
          Histórico de Dados
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sensors.slice(0, 4).map((sensor: Sensor) => (
            <SensorChart key={`chart-${sensor.id}`} sensor={sensor} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-[var(--border-color)] bg-[var(--surface-strong)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[var(--text-secondary)] text-center">
            Dashboard de Monitoramento IoT • Desenvolvido com Next.js +
            TypeScript + Recharts
          </p>
          <p className="text-[var(--accent-soft)] text-center text-sm mt-2 tracking-wide">
            desenvolvido por: perres9
          </p>
        </div>
      </footer>
    </div>
  );
};
