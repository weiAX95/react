/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          stream: false,
        };
        return config;
      },
};

export default nextConfig;
