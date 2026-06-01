# ELEMENT CONCEPT — Telegram Mini App

Next.js + Prisma + PostgreSQL.

## Prisma 7

- `prisma/schema.prisma` — модели, `DATABASE_URL` только в `prisma.config.ts`
- `prisma.config.ts` — URL, migrations, **seed**
- Клиент: `src/generated/prisma/client` + `@prisma/adapter-pg`

```bash
cp .env.example .env
pnpm db:push
pnpm db:seed          # в v7 seed не запускается автоматически после migrate
pnpm exec prisma generate
```

## Разработка

```bash
pnpm install
pnpm dev
```
