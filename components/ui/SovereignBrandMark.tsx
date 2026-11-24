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
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Arbizu Labs Sovereign Isotype"
    >
      <rect x="0" y="0" width="24" height="24" rx="4" fill="#0B0D12" />
      <path
        d="M16.5 4.5 H8 L4.5 8 V16.5"
        stroke="#F2F0EA"
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <polygon points="10.5,19.5 16,19.5 19.5,16 19.5,10.5" fill="#FF4F00" />
      <path
        d="M8.5 15.5 L15.5 8.5"
        stroke="#F2F0EA"
        strokeWidth="2.4"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

export function AldoArbizuMonogram({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Aldo Arbizu Principal Architect Monogram"
    >
      <rect x="0" y="0" width="24" height="24" rx="4" fill="#07080A" />
      <path
        d="M5.5 19.5 L12 4.5 L18.5 19.5"
        stroke="#F2F0EA"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <path
        d="M8.5 14 L15.5 11.5"
        stroke="#D4AF37"
        strokeWidth="2.3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="18.2" r="1.8" fill="#D4AF37" />
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
