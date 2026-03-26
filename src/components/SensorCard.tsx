"use client";

/**
 * Sensor Card Component
 * Displays individual sensor data and statistics
 */

import { Sensor } from "@/types/sensor";
import { StatusBadge } from "./StatusBadge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SensorCardProps {
  sensor: Sensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const readings = sensor.readings;
  const currentValue = sensor.currentValue;
  const previousValue =
    readings.length > 1 ? readings[readings.length - 2].value : currentValue;
  const isIncreasing = currentValue > previousValue;

  const avgValue =
    readings.length > 0
      ? readings.reduce((sum, r) => sum + r.value, 0) / readings.length
      : currentValue;

  const minValue =
    readings.length > 0
      ? Math.min(...readings.map((r) => r.value))
      : currentValue;

  const maxValue =
    readings.length > 0
      ? Math.max(...readings.map((r) => r.value))
      : currentValue;

  return (
    <div className="glass lift-hover rounded-2xl p-6 fade-in-up">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            {sensor.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {sensor.location}
          </p>
        </div>
        <StatusBadge status={sensor.status} />
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[var(--accent)]">
            {currentValue.toFixed(2)}
          </span>
          <span className="text-[var(--text-secondary)]">{sensor.unit}</span>
          <div
            className={`flex items-center gap-1 ${isIncreasing ? "text-amber-400" : "text-emerald-400"}`}
          >
            {isIncreasing ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm">
              {Math.abs(currentValue - previousValue).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="surface-strong rounded-xl p-3">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Média</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {avgValue.toFixed(2)}
          </p>
        </div>
        <div className="surface-strong rounded-xl p-3">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Mín</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {minValue.toFixed(2)}
          </p>
        </div>
        <div className="surface-strong rounded-xl p-3">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Máx</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {maxValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 text-xs text-[var(--text-secondary)]">
        Atualizado: {new Date(sensor.lastUpdate).toLocaleTimeString("pt-BR")}
      </div>
    </div>
  );
};
