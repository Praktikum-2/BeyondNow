import prisma from "../db";

export const getAllSkills = async () => {
  return await prisma.skills.findMany();
};
