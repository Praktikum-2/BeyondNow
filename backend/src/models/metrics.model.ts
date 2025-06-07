import prisma from "../db";

export const countDepartmentsByOrganizationId = async (organizationId: string) => {
    return await prisma.department.count({
        where: { organization_id_fk: organizationId },
    });
};

export const countEmployeesByOrganizationId = async (organizationId: string) => {
    // Najprej pridobi vse oddelke organizacije
    const departments = await prisma.department.findMany({
        where: { organization_id_fk: organizationId },
        select: { department_id: true },
    });

    const departmentIds = departments.map((d) => d.department_id);

    if (departmentIds.length === 0) return 0;

    // Štej zaposlene, ki so v teh oddelkih
    return await prisma.employee.count({
        where: {
            department_id_fk: { in: departmentIds },
        },
    });
};

export const countProjectsByOrganizationId = async (organizationId: string) => {
    // Najprej pridobi zaposlene, ki so v organizaciji (tj. zaposleni v oddelkih org)
    const departments = await prisma.department.findMany({
        where: { organization_id_fk: organizationId },
        select: { department_id: true },
    });

    const departmentIds = departments.map((d) => d.department_id);
    if (departmentIds.length === 0) return 0;

    const employees = await prisma.employee.findMany({
        where: {
            department_id_fk: { in: departmentIds },
        },
        select: { employee_id: true },
    });

    const employeeIds = employees.map((e) => e.employee_id);
    if (employeeIds.length === 0) return 0;

    // Štej projekte, kjer je projectManager zaposlenec iz te organizacije
    return await prisma.project.count({
        where: {
            projectManager_id: { in: employeeIds },
        },
    });
};
