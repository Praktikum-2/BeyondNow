import e from "cors";
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
  skills: string[];
}) => {
  // console.log("Starting employee creation");
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

  // console.log("Creating employee:", ime, priimek);

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

export const getAllEmployeeforGraph = async () => {
  return await prisma.employee.findMany({
    include: {
      Department_Employee_department_id_fkToDepartment: true,
      Role: {
        include: {
          Project: true, // <- točno tako, z veliko začetnico
        },
      },
      EmployeeSkill: {
        include: {
          Skills: true,
        },
      },
    },
  });
};

export const getAllEmployeeforGraphDepartment = async (
  department_id: string
) => {
  return await prisma.employee.findMany({
    where: {
      department_id_fk: department_id,
    },
    include: {
      Department_Employee_department_id_fkToDepartment: true,
      Role: {
        include: {
          Project: true,
        },
      },
      EmployeeSkill: {
        include: {
          Skills: true,
        },
      },
    },
  });
};

export const getAllEmployeeforGraphSkills = async (skills: string[]) => {
  const filteredEmployees = await prisma.employee.findMany({
    where: {
      EmployeeSkill: {
        some: {
          skills_id_fk: skills[0],
          NOT: {
            skills_id_fk: null,
          },
        },
      },
    },
    include: {
      Department_Employee_department_id_fkToDepartment: true,
      Role: {
        include: {
          Project: true,
        },
      },
      EmployeeSkill: {
        include: {
          Skills: true,
        },
      },
    },
  });

  return filteredEmployees;
};
