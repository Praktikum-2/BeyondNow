import prisma from "../db";

export const getAllDepartments = async () => {
  return await prisma.department.findMany({
    select: {
      department_id: true,
      name: true,
      departmentLeader_id_fk: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
/*
export const createDepartment = async (data: {
  name: string;
  organization_id_fk: string;
  departmentLeader_id_fk?: string | null;
}) => {
  return await prisma.department.create({
    data: {
      name: data.name,
      organization_id_fk: data.organization_id_fk,
      departmentLeader_id_fk: data.departmentLeader_id_fk || null,
    },
  });
};
*/
