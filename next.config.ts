import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Loader propio: los bytes salen del CDN de Sanity, no del optimizador
    // de Next, que sobre Workers es el punto debil del stack (spec §18.2).
    loader: "custom",
    loaderFile: "./src/sanity/image-loader.ts",
  },
};

export default nextConfig;
