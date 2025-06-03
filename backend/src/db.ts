import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

checkDbConnection();

export default prisma;
