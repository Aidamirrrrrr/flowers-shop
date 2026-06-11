# ELEMENT CONCEPT — Telegram Mini App

Next.js 16 + React 19 + Prisma 7 + PostgreSQL + Tailwind 4 + shadcn/ui.

## Стек

| Пакет | Версия |
|-------|--------|
| Next.js | 16.x (Turbopack) |
| React | 19.x |
| Prisma | 7.x |
| Tailwind CSS | 4.x |

## Быстрый старт

```bash
cp .env.example .env
pnpm install
pnpm db:setup
pnpm dev
```

Если dev падает с `Cannot find module` — очистите кэш:

```bash
pnpm dev:clean
```

## База данных

```bash
pnpm db:push      # применить схему (локально, без истории миграций)
pnpm db:deploy    # применить миграции (прод / Railway)
pnpm db:seed      # засеять товары
pnpm db:setup     # push + seed
```

**Railway:** добавьте `DATABASE_URL` в Variables. После деплоя выполните `pnpm db:deploy` (или в build-команде), затем при необходимости `pnpm db:seed`.

## Демо-админ

После `pnpm db:seed` пользователь TG mock (id `100001`) — **ADMIN**.  
Вкладка «Админ» появится в нижнем таб-баре.
