/** @type {import('next').NextConfig} */
const nextConfig = {
  //outputFileTracing: false,

  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    // Variables Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  experimental: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Configuration des rewrites nécessaires
  async rewrites() {
    return [
      // Règle pour les API
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
      // Règles essentielles pour les routes dynamiques
      {
        source: "/products/:id",
        destination: "/products/[id]",
      },
      {
        source: "/api/accounts/:id",
        destination: "/api/accounts/[id]",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/pdp.png",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
