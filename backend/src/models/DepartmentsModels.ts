import prisma from "../db";

export const getAllDepartments = async () => {
  return await prisma.department.findMany({
    select: {
      department_id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
