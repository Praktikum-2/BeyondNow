import prisma from "../db";

export const getUserByUid = async (uid: string) => {
    return await prisma.user.findUnique({
        where: { uid },
    });
};

export const getOrganizationByUserUid = async (uid: string) => {
    return await prisma.organization.findUnique({
        where: { user_uid: uid },
    });
};

export const updateUserName = async (uid: string, name: string) => {
    return await prisma.user.update({
        where: { uid },
        data: { name },
    });
};

export const updateOrganizationNameByUserUid = async (uid: string, organizationName: string) => {
    return await prisma.organization.update({
        where: { user_uid: uid }, // user_uid je unique
        data: { name: organizationName },
    });
};
