"use client";

/**
 * Sensor Chart Component
 * Displays sensor data history in a line chart using Recharts
 */

import { Sensor } from "@/types/sensor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SensorChartProps {
  sensor: Sensor;
}

export const SensorChart: React.FC<SensorChartProps> = ({ sensor }) => {
  const isDarkTheme =
    typeof window !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  const data = sensor.readings.map((reading) => ({
    timestamp: new Date(reading.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: reading.value,
  }));

  const getLineColor = (type: string) => {
    switch (type) {
      case "temperature":
        return "#fb923c";
      case "humidity":
        return "#f97316";
      case "pressure":
        return "#fdba74";
      case "light":
        return "#facc15";
      default:
        return "#fb923c";
    }
  };

  return (
    <div className="glass rounded-2xl p-6 fade-in-up">
      <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        {sensor.name}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={
              isDarkTheme
                ? "rgba(255, 191, 146, 0.25)"
                : "rgba(194, 65, 12, 0.18)"
            }
          />
          <XAxis
            dataKey="timestamp"
            style={{ fontSize: "12px" }}
            stroke={isDarkTheme ? "#ffbf92" : "#9a3412"}
          />
          <YAxis stroke={isDarkTheme ? "#ffbf92" : "#9a3412"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkTheme
                ? "rgba(44, 28, 20, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              border: isDarkTheme
                ? "1px solid rgba(251, 146, 60, 0.45)"
                : "1px solid rgba(194, 65, 12, 0.3)",
              borderRadius: "10px",
              color: isDarkTheme ? "#ffe8d7" : "#2a1407",
            }}
          />
          <Legend
            wrapperStyle={{ color: isDarkTheme ? "#ffbf92" : "#9a3412" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor(sensor.type)}
            dot={{ fill: getLineColor(sensor.type), r: 4 }}
            activeDot={{ r: 6 }}
            name={`${sensor.name} (${sensor.unit})`}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
