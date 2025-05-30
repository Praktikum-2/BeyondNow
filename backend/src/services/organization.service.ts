import prisma from "../db";

export const createOrganization = async (
  userUid: string,
  name: string
) => {
  return prisma.organization.create({
    data: {
      name,
      user_uid: userUid,
    },
  });
};

export const getOrganizationByUserUid = async (userUid: string) => {
  return prisma.organization.findFirst({
    where: {
      user_uid: userUid,
    },
  });
};
