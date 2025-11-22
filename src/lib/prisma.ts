// MOCK MODE PRISMA STUB
// The real PrismaClient is not used in mock mode to avoid needing the package or a database.
// We export a minimal object with the shape of the properties we might access.
// Extend as needed if some code attempts deeper calls.
export const prisma: any = {
  user: {
    findUnique: async () => null,
    create: async (data: any) => ({ id: 'mock-user', ...data.data }),
  },
  booking: {
    findUnique: async () => null,
    create: async (data: any) => ({ id: 'mock-booking', ...data.data }),
    update: async (data: any) => ({ ...data.data }),
  }
}
