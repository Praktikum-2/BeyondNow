import prisma from "../db";

// Pridobi profil uporabnika z njegovo organizacijo
export const getUserProfile = async (uid: string) => {
    return await prisma.user.findUnique({
        where: { uid },
        include: {
            organization: true,
        },
    });
};

// Posodobi ime organizacije glede na user_uid (user_uid je unique)
export const updateOrganizationNameByUserUid = async (
    uid: string,
    organizationName: string
) => {
    return await prisma.organization.update({
        where: { user_uid: uid },
        data: { name: organizationName },
    });
};
