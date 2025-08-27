import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create courier partners
  const courierPartners = [
    {
      id: '1',
      name: 'Delhivery',
      logo: '📦',
      basePrice: 40,
      pricePerKg: 20,
      isActive: true,
    },
    {
      id: '2', 
      name: 'Shadowfax',
      logo: '🚀',
      basePrice: 35,
      pricePerKg: 18,
      isActive: true,
    },
    {
      id: '3',
      name: 'Ekart',
      logo: '📮',
      basePrice: 45,
      pricePerKg: 22,
      isActive: true,
    },
    {
      id: '4',
      name: 'BlueDart',
      logo: '🔵',
      basePrice: 60,
      pricePerKg: 30,
      isActive: true,
    },
    {
      id: '5',
      name: 'DTDC',
      logo: '📫',
      basePrice: 38,
      pricePerKg: 19,
      isActive: true,
    },
  ]

  console.log('Seeding courier partners...')
  for (const partner of courierPartners) {
    await prisma.courierPartner.upsert({
      where: { id: partner.id },
      update: partner,
      create: partner,
    })
  }

  // Create demo user
  const demoUser = {
    id: 'demo-user-1',
    email: 'demo@shipmart.com',
    firstName: 'Demo',
    lastName: 'User',
    phone: '+91 98765 43210',
    password: '$2a$10$rQZ5VQZ5VQZ5VQZ5VQZ5VO.QZ5VQZ5VQZ5VQZ5VQZ5VQZ5VQZ5VQZ5', // password123
  }

  console.log('Seeding demo user...')
  await prisma.user.upsert({
    where: { email: demoUser.email },
    update: demoUser,
    create: demoUser,
  })

  console.log('Seed data created successfully!')
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
