import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aldo Alberto Arbizu | Principal Systems Architect",
    short_name: "Aldo Arbizu",
    description: "Principal Systems Architect, Staff SRE & Offline-First / Quantitative Engineering",
    start_url: "/",
    display: "standalone",
    background_color: "#060709",
    theme_color: "#060709",
    orientation: "any",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 32x32 16x16",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
