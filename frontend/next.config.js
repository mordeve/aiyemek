/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    // Enable dynamic features
    experimental: {
        serverActions: true,
    },
    // Configure static generation
    staticPageGenerationTimeout: 120,
    // Enable React strict mode
    reactStrictMode: true,
    // Configure output
    output: 'standalone',
    // Proxy API requests
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/api/:path*',
                    destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
                },
            ],
        };
    },
    // Suppress punycode warning
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                punycode: false,
            };
        }
        return config;
    },
}

module.exports = nextConfig; 