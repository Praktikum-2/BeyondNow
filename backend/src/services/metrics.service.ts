import * as metricsModel from "../models/metrics.model";

export const getOrganizationMetrics = async (organizationId: string) => {
    const [departmentsCount, employeesCount, projectsCount] = await Promise.all([
        metricsModel.countDepartmentsByOrganizationId(organizationId),
        metricsModel.countEmployeesByOrganizationId(organizationId),
        metricsModel.countProjectsByOrganizationId(organizationId),
    ]);

    return {
        departmentsCount,
        employeesCount,
        projectsCount,
    };
};
