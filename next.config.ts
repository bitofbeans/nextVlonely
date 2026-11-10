import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// Refresh the allowed LAN addresses each time the dev server starts.
const devOrigins = process.env.NODE_ENV === "development"
    ? Object.values(networkInterfaces())
        .flatMap((addresses) => addresses ?? [])
        .filter((address) => address.family === "IPv4" && !address.internal)
        .map((address) => address.address)
    : [];


console.log(devOrigins)

const nextConfig: NextConfig = {
    allowedDevOrigins: devOrigins,
    images: {
        remotePatterns: [{
            protocol: "https",
            // for CORS
            hostname: "r2.vlfriends.com",
        }],
        unoptimized: true // too many damn image optimizations. got enough fdt so use that for now
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['vlonelyandfriends.vercel.app', 'vlfriends.com'],
        },
        
    }
};

export default nextConfig;
