import prisma from "../db";
import { User } from "@prisma/client";

export class UserModel {
  static async findByUid(uid: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { uid },
    });
  }

  static async updateEmail(uid: string, email: string): Promise<User> {
    return await prisma.user.update({
      where: { uid },
      data: { email },
    });
  }

  static async create(userData: {
    uid: string;
    email: string;
    name?: string | null;
  }): Promise<User> {
    return await prisma.user.create({
      data: {
        uid: userData.uid,
        email: userData.email,
        name: userData.name || null,
        organization: undefined,
      },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
