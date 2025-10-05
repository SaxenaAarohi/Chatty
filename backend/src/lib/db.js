import pkg from '@prisma/client';

const {PrismaClient} = pkg;

export const prismaclient = new PrismaClient();

export const connectDB = async () => {
  try {
    await prismaclient.$connect();
    console.log("Prisma connected successfully!");
  } catch (error) {
    console.log("Prisma connection error:", error);
  }
};
