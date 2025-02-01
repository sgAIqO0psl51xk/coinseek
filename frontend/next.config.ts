import type { NextConfig } from "next";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(new MiniCssExtractPlugin());
    return config;
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "artificialanalysis.ai",
        port: "",
        pathname: "/**/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "custom.typingmind.com",
        port: "",
        pathname: "/**/**/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
