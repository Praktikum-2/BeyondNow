import prisma from "../db";

export const getAllEmployees = async () => {
  return await prisma.employee.findMany({
    include: {
      Department_Employee_department_id_fkToDepartment: true,
      EmployeeSkill: {
        include: {
          Skills: true,
        },
      },
      Role: true,
    },
  });
};

export const createNewEmployee = async (rawData: {
  ime: string;
  priimek: string;
  email: string;
  department_id_fk: string;
  skills: string[]; // array of skill_id (UUID strings)
}) => {
  console.log("Starting employee creation");
  const { ime, priimek, email, department_id_fk, skills } = rawData;

  const data = {
    ime,
    priimek,
    email,
    department_id_fk,
    EmployeeSkill: {
      create: skills.map((skillId) => ({
        skills_id_fk: skillId,
      })),
    },
  };

  console.log("Creating employee:", ime, priimek);

  const result = await prisma.employee.create({
    data,
    include: {
      EmployeeSkill: {
        include: {
          Skills: true,
        },
      },
      Department_Employee_department_id_fkToDepartment: true,
      Role: true,
    },
  });

  return result;
};
