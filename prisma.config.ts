import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * Prisma CLI loads this file during `postinstall` / `prisma generate` on CI
 * when DATABASE_URL is not set yet. A placeholder is enough for client generation.
 */
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://build:build@127.0.0.1:5432/build?schema=public'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
})
