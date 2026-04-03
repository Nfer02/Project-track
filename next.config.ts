import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Prisma y pg se resuelven en el servidor, no en el bundle del cliente
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],

  // No exponer "X-Powered-By: Next.js" en producción
  poweredByHeader: false,
}

export default nextConfig
