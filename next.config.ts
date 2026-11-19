import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity entrega las imagenes ya optimizadas y del tamano pedido (spec §18.2),
  // y el optimizador de Next sobre Workers es un punto debil. Se evalua en el paso 0.4.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
