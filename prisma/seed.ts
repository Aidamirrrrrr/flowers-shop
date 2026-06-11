import 'dotenv/config'
import { createPrismaClient } from '../src/lib/create-prisma-client'
import { CART_SUGGESTION_IDS } from '../src/data/cartSuggestions'
import { CATEGORIES, PRODUCTS } from '../src/data/products'

const prisma = createPrismaClient()

async function main() {
  for (const cat of CATEGORIES.filter((c) => c.id !== 'all')) {
    await prisma.category.upsert({
      where: { id: cat.id },
      create: { id: cat.id, label: cat.label, sort: 0 },
      update: { label: cat.label },
    })
  }

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        description: p.description,
        careTips: p.careTips,
        categoryId: p.category,
        active: true,
      },
      update: {
        name: p.name,
        price: p.price,
        image: p.image,
        description: p.description,
        careTips: p.careTips,
        categoryId: p.category,
      },
    })
  }

  let sort = 0
  for (const productId of CART_SUGGESTION_IDS) {
    await prisma.cartSuggestion.upsert({
      where: { productId },
      create: { productId, sort: sort++ },
      update: { sort: sort - 1 },
    })
  }

  await prisma.user.upsert({
    where: { telegramId: BigInt(100001) },
    create: {
      telegramId: BigInt(100001),
      username: 'demo_flowers',
      firstName: 'Анна',
      lastName: 'Демо',
      role: 'ADMIN',
    },
    update: {
      username: 'demo_flowers',
      firstName: 'Анна',
      lastName: 'Демо',
      role: 'ADMIN',
    },
  })

  await prisma.appSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      deliveryText: 'Доставка от 2 часов · Оплата при получении',
      deliveryHours: '9:00–21:00',
    },
    update: {},
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
