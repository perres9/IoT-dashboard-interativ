"use client";

/**
 * Status Badge Component
 * Displays sensor connection status
 */

import { Wifi, WifiOff } from "lucide-react";

interface StatusBadgeProps {
  status: "online" | "offline";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isOnline = status === "online";

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${
        isOnline
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/35"
          : "bg-rose-500/15 text-rose-300 border-rose-500/35"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          Offline
        </>
      )}
    </div>
  );
};
