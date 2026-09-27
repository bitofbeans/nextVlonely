import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// Refresh the allowed LAN addresses each time the dev server starts.
const devOrigins = process.env.NODE_ENV === "development"
    ? Object.values(networkInterfaces())
        .flatMap((addresses) => addresses ?? [])
        .filter((address) => address.family === "IPv4" && !address.internal)
        .map((address) => address.address)
    : [];

const nextConfig: NextConfig = {
    allowedDevOrigins: devOrigins,
    images: {
        remotePatterns: [{
            protocol: "https",
            // for CORS
            hostname: "pub-7d9f960619014d718c32e0a9bbc45403.r2.dev",
        }]
    }
};

export default nextConfig;
