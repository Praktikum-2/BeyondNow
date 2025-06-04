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

export const createDepartment = async (data: {
  name: string;
  organization_id_fk: string;
  departmentLeader_id_fk?: string | null;
}) => {
  return await prisma.department.create({
    data: {
      name: data.name,
      organization_id_fk: data.organization_id_fk,
      departmentLeader_id_fk: data.departmentLeader_id_fk,
    },
  });
};


// Nova funkcija za pridobitev departmentov glede na organizacijo
export const getAllDepartmentsByOrganization = async (organizationId: string) => {
  return await prisma.department.findMany({
    where: {
      organization_id_fk: organizationId,
    },
    select: {
      department_id: true,
      name: true,
      departmentLeader_id_fk: true,
      Developer_Department_departmentLeader_id_fkToDeveloper: {  // relacija na Employee
        select: {
          ime: true,
          priimek: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};
