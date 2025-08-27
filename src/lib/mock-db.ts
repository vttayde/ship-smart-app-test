// Simple in-memory mock database replacing Prisma during stub period.
export interface MockUser { id: string; email: string; password: string; firstName: string; lastName: string; phone?: string; image?: string }
export const mockUsers: MockUser[] = [];

export function findUserByEmail(email: string) {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createUser(data: Omit<MockUser, 'id'>) {
  const user: MockUser = { id: 'U' + Date.now().toString(36), ...data };
  mockUsers.push(user);
  return user;
}

// Booking / Payment placeholders can be added later as needed.