/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import process from "process/browser";

const nextConfig = {
  distDir: "build",
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "images.unsplash.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      process: require.resolve("process/browser"),
    };
    return config;
  },
};

export default withPWA({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
