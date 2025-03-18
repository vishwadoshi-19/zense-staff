/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

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
};

export default withPWA({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
