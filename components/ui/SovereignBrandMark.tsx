import React from "react";

export type DynastySystemCode =
  | "SYS-01"
  | "SYS-02"
  | "SYS-03"
  | "SYS-04"
  | "SYS-05"
  | "SYS-06"
  | "SYS-07"
  | "SYS-08"
  | "SYS-09"
  | "SYS-10"
  | "SYS-11"
  | "SYS-12";

export interface DynastyMeta {
  code: DynastySystemCode;
  label: string;
  stroke: string;
  accent: string;
}

export const DYNASTY_SYSTEMS: Record<DynastySystemCode, DynastyMeta> = {
  "SYS-01": { code: "SYS-01", label: "TITANFLOW QUANT", stroke: "#D4AF37", accent: "#00E599" },
  "SYS-02": { code: "SYS-02", label: "SENTINEL·OS", stroke: "#00B4D8", accent: "#00E599" },
  "SYS-03": { code: "SYS-03", label: "AGROMARKET PRO", stroke: "#10B981", accent: "#FF4F00" },
  "SYS-04": { code: "SYS-04", label: "NOMAD HUB", stroke: "#FF4F00", accent: "#F2F0EA" },
  "SYS-05": { code: "SYS-05", label: "VERIFY TRUST", stroke: "#00B4D8", accent: "#D4AF37" },
  "SYS-06": { code: "SYS-06", label: "CANNASAVIAS", stroke: "#10B981", accent: "#D4AF37" },
  "SYS-07": { code: "SYS-07", label: "AEROSHOT GIS", stroke: "#10B981", accent: "#FF4F00" },
  "SYS-08": { code: "SYS-08", label: "AB3D-FORGE", stroke: "#FF4F00", accent: "#D4AF37" },
  "SYS-09": { code: "SYS-09", label: "HABITAT ENGINE", stroke: "#FF4F00", accent: "#F2F0EA" },
  "SYS-10": { code: "SYS-10", label: "ECOCONNECT ESG", stroke: "#10B981", accent: "#00E599" },
  "SYS-11": { code: "SYS-11", label: "AUREUS WEALTH", stroke: "#D4AF37", accent: "#F2F0EA" },
  "SYS-12": { code: "SYS-12", label: "MARKETING AI", stroke: "#D4AF37", accent: "#FF4F00" },
};

export function ArbizuLabsMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="Arbizu Labs Sovereign Isotype"
    >
      <polygon
        points="18,4 46,4 60,18 60,46 46,60 18,60 4,46 4,18"
        fill="#0B0D12"
        stroke="#F2F0EA"
        strokeWidth="2"
      />
      <polygon
        points="20,9 44,9 55,20 55,44 44,55 20,55 9,44 9,20"
        stroke="#262C3A"
        strokeWidth="1"
      />
      <path d="M32 13L49 48H41.5L32 27.5L22.5 48H15L32 13Z" fill="#F2F0EA" />
      <path d="M23 39H41" stroke="#0B0D12" strokeWidth="4" />
      <rect x="29" y="35" width="6" height="6" fill="#FF4F00" />
      <path d="M32 4V8M32 56V60M4 32H8M56 32H60" stroke="#D4AF37" strokeWidth="1.5" />
    </svg>
  );
}

export function AldoArbizuMonogram({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="Aldo Arbizu Principal Architect Monogram"
    >
      <polygon
        points="18,4 46,4 60,18 60,46 46,60 18,60 4,46 4,18"
        fill="#060709"
        stroke="#D4AF37"
        strokeWidth="1.75"
      />
      <circle cx="32" cy="32" r="21" stroke="#1E2430" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M32 12L48 46H42L32 24L22 46H16L32 12Z" fill="#F2F0EA" />
      <path d="M32 25L41 46H36.5L32 35.5L27.5 46H23L32 25Z" fill="#D4AF37" />
      <circle cx="32" cy="43" r="2.2" fill="#00E599" />
    </svg>
  );
}

export function ProductDynastyBadge({
  code,
  className = "w-8 h-8",
}: {
  code: DynastySystemCode;
  className?: string;
}) {
  const meta = DYNASTY_SYSTEMS[code] ?? DYNASTY_SYSTEMS["SYS-01"];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-label={`${meta.code} ${meta.label}`}
    >
      <polygon
        points="14,3 34,3 45,14 45,34 34,45 14,45 3,34 3,14"
        fill="#0B0D12"
        stroke={meta.stroke}
        strokeWidth="1.5"
      />
      {code === "SYS-01" || code === "SYS-11" ? (
        <>
          <path d="M11 31L19 21L26 26L37 14" stroke={meta.accent} strokeWidth="2" strokeLinecap="square" />
          <rect x="34" y="11" width="5" height="5" fill={meta.stroke} />
          <path d="M11 36H37" stroke="#262C3A" strokeWidth="1.5" />
        </>
      ) : code === "SYS-02" || code === "SYS-05" ? (
        <>
          <path
            d="M24 10L36 15V24C36 31.5 30.8 36.8 24 39C17.2 36.8 12 31.5 12 24V15L24 10Z"
            stroke="#F2F0EA"
            strokeWidth="1.75"
          />
          <circle cx="24" cy="24" r="3.5" fill={meta.accent} />
        </>
      ) : code === "SYS-03" || code === "SYS-06" || code === "SYS-07" || code === "SYS-10" ? (
        <>
          <polygon points="24,11 35,17 35,31 24,37 13,31 13,17" stroke="#F2F0EA" strokeWidth="1.75" />
          <path d="M13 24H35M24 11V37" stroke={meta.accent} strokeWidth="1.5" />
        </>
      ) : (
        <>
          <circle cx="24" cy="24" r="11" stroke="#F2F0EA" strokeWidth="1.5" />
          <polygon points="24,11 28,24 24,37 20,24" fill={meta.stroke} />
        </>
      )}
    </svg>
  );
}
