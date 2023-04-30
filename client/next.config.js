/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/(.*)",
        destination: "/",
      },
    ];
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
};

module.exports = nextConfig;
