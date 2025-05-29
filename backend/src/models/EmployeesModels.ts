import { prisma } from "../db";
export const getAllEmployees = async () => {
  return await prisma.employee.findMany();
};

export const createNewEmployee = async (Rawdata: {
  // fixaj se kaj so ustrezni podatki
  ime: string;
  priimek: string;
  department_id_fk: string;
}) => {
  const data = Rawdata;
  console.log("ustvarjam zaposlenega: ", data.ime, data.priimek);
  return await prisma.employee.create({ data });
};
