import { prisma } from "../db";
export const getAllEmployees = async () => {
  return await prisma.employee.findMany();
};

export const createNewEmployee = async (Rawdata: {
  ime: string;
  priimek: string;
  email: string;
  department_id_fk: string;
  skills: string[]; // array of skill_id (UUID strings)
}) => {
  console.log("zacenjam ustvarjanje zaposlenega");
  const { ime, priimek, email, department_id_fk, skills } = Rawdata;

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

  console.log("Ustvarjam zaposlenega:", ime, priimek);

  const rezultatKreiranja = await prisma.employee.create({
    data,
    include: {
      EmployeeSkill: true,
    },
  });

  return "zaposleni je ustvarjen: " + rezultatKreiranja;
};
