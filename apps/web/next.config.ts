import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../config/.env"),
});

const nextConfig: NextConfig = {
  images: {
    domains: [
      "sistemasproyectos.uniandes.edu.co",
      "sistemas.uniandes.edu.co",
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
