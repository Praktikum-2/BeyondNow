import prisma from "../db";

export const getAllRoles = async () => {
  return await prisma.role.findMany({
    include: {
      Employee: {
        include: {
          Department_Employee_department_id_fkToDepartment: true,
          EmployeeSkill: {
            include: {
              Skills: true,
            },
          },
        },
      },
      Project: true,
    },
  });
};

export const createNewRole = async (rawData: {
  employee_id_fk: string;
  project_id_fk: string;
  employeeRole: string;
  allocation?: number;
}) => {
  const { employee_id_fk, project_id_fk, employeeRole, allocation } = rawData;

  const data = {
    employee_id_fk,
    project_id_fk,
    employeeRole,
    allocation: allocation || 100, // 100% defautl
  };

  const result = await prisma.role.create({
    data,
    include: {
      Employee: {
        include: {
          Department_Employee_department_id_fkToDepartment: true,
          EmployeeSkill: {
            include: {
              Skills: true,
            },
          },
        },
      },
      Project: true,
    },
  });

  return result;
};

export const getRolesByProject = async (project_id_fk: string) => {
  return await prisma.role.findMany({
    where: {
      project_id_fk,
    },
    include: {
      Employee: {
        include: {
          Department_Employee_department_id_fkToDepartment: true,
          EmployeeSkill: {
            include: {
              Skills: true,
            },
          },
        },
      },
      Project: true,
    },
  });
};

export const getRolesByEmployee = async (employee_id_fk: string) => {
  return await prisma.role.findMany({
    where: {
      employee_id_fk,
    },
    include: {
      Employee: {
        include: {
          Department_Employee_department_id_fkToDepartment: true,
          EmployeeSkill: {
            include: {
              Skills: true,
            },
          },
        },
      },
      Project: true,
    },
  });
};

export const updateRole = async (
  role_id: string,
  updateData: {
    employeeRole?: string;
    allocation?: number;
  }
) => {
  return await prisma.role.update({
    where: {
      role_id,
    },
    data: updateData,
    include: {
      Employee: {
        include: {
          Department_Employee_department_id_fkToDepartment: true,
          EmployeeSkill: {
            include: {
              Skills: true,
            },
          },
        },
      },
      Project: true,
    },
  });
};

export const deleteRole = async (role_id: string) => {
  return await prisma.role.delete({
    where: {
      role_id,
    },
  });
};
