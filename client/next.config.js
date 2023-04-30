/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { runtime: "edge" },
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
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  },
};

module.exports = nextConfig;
