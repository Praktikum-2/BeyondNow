import prisma from "../db";
import { User, Organization } from "@prisma/client";

type UserWithOrganization = User & {
  organization?: Organization | null;
};

export class UserModel {
  static async findByUid(uid: string): Promise<UserWithOrganization | null> {
    return await prisma.user.findUnique({
      where: { uid },
      include: {
        organization: true,
      },
    });
  }

  static async updateEmail(
    uid: string,
    email: string
  ): Promise<UserWithOrganization> {
    return await prisma.user.update({
      where: { uid },
      data: { email },
      include: {
        organization: true,
      },
    });
  }

  static async create(userData: {
    uid: string;
    email: string;
    name?: string | null;
  }): Promise<UserWithOrganization> {
    return await prisma.user.create({
      data: {
        uid: userData.uid,
        email: userData.email,
        name: userData.name || null,
      },
      include: {
        organization: true,
      },
    });
  }

  static async findByEmail(
    email: string
  ): Promise<UserWithOrganization | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });
  }
}
