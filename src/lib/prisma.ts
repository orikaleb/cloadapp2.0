// Prisma is being phased out in favor of Firebase
// This file is kept for backward compatibility with routes that haven't been migrated yet

// Mock Prisma client that matches the API but throws helpful errors
export const prisma = {
  $connect: async () => {
    console.warn('Prisma is deprecated. Please migrate to Firebase.');
  },
  customer: {
    findUnique: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    findMany: async (_args?: any): Promise<any[]> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    create: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    update: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    delete: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    count: async (_args?: any): Promise<number> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
  },
  product: {
    findUnique: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    findMany: async (_args?: any): Promise<any[]> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    create: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    update: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    delete: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    count: async (_args?: any): Promise<number> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
  },
  category: {
    findUnique: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    findMany: async (_args?: any): Promise<any[]> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    create: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    createMany: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    update: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    delete: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    count: async (_args?: any): Promise<number> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
  },
  order: {
    findUnique: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    findMany: async (_args?: any): Promise<any[]> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    create: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    update: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    delete: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    count: async (_args?: any): Promise<number> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
  },
  orderItem: {
    findMany: async (_args?: any): Promise<any[]> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
    create: async (_args: any): Promise<any> => {
      throw new Error('Prisma is deprecated. Please migrate this route to use Firebase Firestore.');
    },
  },
  payment: {} as any,
  shipment: {} as any,
  sale: {} as any,
  productImage: {} as any,
  cartItem: {} as any,
  shoppingCart: {} as any,
};
