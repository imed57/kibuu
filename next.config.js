/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["chainlist.org"],
    },
    transpilePackages: ['@uniswap/widgets', '@uniswap/conedison'], // Add this line to transpile the package

    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false, // Ignore the 'fs' module in the browser
        };
        return config;
    },
};

module.exports = nextConfig;
