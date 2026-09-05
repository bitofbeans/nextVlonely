import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "pub-7d9f960619014d718c32e0a9bbc45403.r2.dev",
            port: "",
            pathname: "/**",
        }]
    }
};

export default nextConfig;
