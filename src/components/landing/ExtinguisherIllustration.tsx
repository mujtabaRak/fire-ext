"use client";

import { motion } from "framer-motion";
import type { ExtinguisherType } from "@/lib/types";

const TYPE_COLORS: Record<ExtinguisherType, string> = {
  ABC: "#dc2626",
  CO2: "#171717",
  HCFC_123: "#7c3aed",
  FOAM: "#0891b2",
  WET_CHEMICAL: "#d97706",
};

export function ExtinguisherIllustration({
  type,
  heightPx,
}: {
  type: ExtinguisherType;
  heightPx: number;
}) {
  const color = TYPE_COLORS[type];
  const bodyWidth = Math.max(28, heightPx * 0.34);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col items-center justify-end"
      style={{ height: heightPx }}
    >
      <svg
        width={bodyWidth}
        height={heightPx}
        viewBox={`0 0 100 ${Math.round((heightPx / bodyWidth) * 100)}`}
        fill="none"
      >
        <rect x="40" y="0" width="20" height="14" rx="3" fill="#525252" />
        <rect x="30" y="10" width="40" height="10" rx="4" fill="#a3a3a3" />
        <rect
          x="20"
          y="18"
          width="60"
          height={Math.round((heightPx / bodyWidth) * 100) - 24}
          rx="16"
          fill={color}
        />
        <rect x="20" y="30" width="60" height="10" fill="rgba(255,255,255,0.18)" />
        <line
          x1="12"
          y1="20"
          x2="4"
          y2="34"
          stroke="#525252"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

export function HumanSilhouette({ heightPx }: { heightPx: number }) {
  return (
    <div className="flex flex-col items-center justify-end" style={{ height: heightPx }}>
      <svg width={heightPx * 0.32} height={heightPx} viewBox="0 0 40 120" fill="none">
        <circle cx="20" cy="12" r="10" fill="#d4d4d4" />
        <path
          d="M8 40C8 30 12 26 20 26C28 26 32 30 32 40V80H8V40Z"
          fill="#d4d4d4"
        />
        <rect x="10" y="78" width="8" height="38" rx="3" fill="#d4d4d4" />
        <rect x="22" y="78" width="8" height="38" rx="3" fill="#d4d4d4" />
      </svg>
      <span className="mt-1 text-[10px] font-medium text-neutral-400">~170cm</span>
    </div>
  );
}
