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
