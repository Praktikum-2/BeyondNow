import { prisma } from "../db";

// Pridobi vse projekte
export const getAllProjects = async () => {
  return await prisma.project.findMany();
};

// Ustvari nov projekt
export const createNewProject = async (data: {
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  projectManager_id: string;
  status: string;
}) => {
  return await prisma.project.create({
    data,
  });
};
