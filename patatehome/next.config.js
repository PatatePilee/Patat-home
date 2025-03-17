/** @type {import('next').NextConfig} */
const nextConfig = {
  //outputFileTracing: false,

  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  },
  experimental: {},
  // Désactivons les rewrites pour utiliser les routes natives de Next.js
  // async rewrites() {
  //   return [
  //     // Règle générique pour API
  //     {
  //       source: "/api/:path*",
  //       destination: "/api/:path*",
  //     },
  //     // Règle spécifique pour les comptes individuels
  //     {
  //       source: "/api/accounts/:id",
  //       destination: "/api/accounts/[id]",
  //     },
  //     // Règle pour les produits
  //     {
  //       source: "/products/:id",
  //       destination: "/products/[id]",
  //     },
  //   ];
  // },
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
};

module.exports = nextConfig;
