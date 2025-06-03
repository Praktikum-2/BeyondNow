import prisma from "../db";

// Pridobi vse projekte
export const getAllProjects = async () => {
  return await prisma.project.findMany();
};

// Ustvari nov projekt
export const createNewProject = async (Rawdata: {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  projectManager_id: string;
  status: string;
}) => {
  const data = {
    ...Rawdata,
    start_date: new Date(Rawdata.start_date),
    end_date: new Date(Rawdata.end_date),
  };
  // console.log(data);
  return await prisma.project.create({
    data,
  });
};

export const getAllTeamMembers = async (projectId: string) => {
  //izvedemo querry
  return await prisma.role.count({
    where: {
      project_id_fk: projectId,
    },
  });
};

export const getCertainProjectManager = async (managerId: string) => {
  return await prisma.employee.findUnique({
    where: {
      employee_id: managerId,
    },
  });
};
