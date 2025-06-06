import prisma from "../db";

export const getAllDepartmentsByOrganization = async (organizationId: string) => {
  return await prisma.department.findMany({
    where: { organization_id_fk: organizationId },
    select: {
      department_id: true,
      name: true,
      departmentLeader_id_fk: true,
      Developer_Department_departmentLeader_id_fkToDeveloper: {
        select: { ime: true, priimek: true },
      },
    },
    orderBy: { name: "asc" },
  });
};

export const getDepartmentById = async (departmentId: string) => {
  return await prisma.department.findUnique({
    where: { department_id: departmentId },
    select: {
      department_id: true,
      name: true,
      Developer_Department_departmentLeader_id_fkToDeveloper: {
        select: { ime: true, priimek: true },
      },
      Employee_Employee_department_id_fkToDepartment: {
        select: { employee_id: true, ime: true, priimek: true },
      },
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
      departmentLeader_id_fk: data.departmentLeader_id_fk || null,
    },
  });
};

export const updateDepartmentById = async (
  departmentId: string,
  data: { name: string; departmentLeader_id_fk?: string | null }
) => {
  return await prisma.department.update({
    where: { department_id: departmentId },
    data: {
      name: data.name,
      departmentLeader_id_fk: data.departmentLeader_id_fk || null,
    },
  });
};

export const deleteDepartmentById = async (departmentId: string) => {
  return await prisma.department.delete({
    where: { department_id: departmentId },
  });
};

// ---- Dodana funkcija, ki ti verjetno manjka (organizacija glede na uid) ----
export const getOrganizationByUserUid = async (uid: string) => {
  // Predpostavljam, da je tabela Organization zvezana s tabelo User ali podobno
  // prilagodi po svoji shemi!
  return await prisma.organization.findFirst({
    where: {
      user_uid: uid, // prilagodi glede na pravo polje, ki povezuje user in org
    },
  });
};

export const getDepartmentEmployees = async (departmentId: string) => {
  return await prisma.employee.findMany({
    where: { department_id_fk: departmentId },
    select: {
      employee_id: true,
      ime: true,
      priimek: true,
      email: true,
      Role: {
        select: {
          employeeRole: true
        }
      },
      EmployeeSkill: {
        select: {
          Skills: {
            select: {
              skill: true
            }
          }
        }
      }
    }
  });
};