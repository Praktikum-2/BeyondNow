import { UserModel } from "../models/user.model";
import { User } from "@prisma/client";

export const findOrCreateUserByFirebase = async (
  uid: string,
  email: string | undefined,
  name?: string
): Promise<User> => {
  try {
    let user = await UserModel.findByUid(uid);

    if (user) {
      if (email && user.email !== email) {
        console.log("Updating user email...");
        user = await UserModel.updateEmail(uid, email);
        console.log("User email updated");
      }
      return user;
    }

    if (!email) {
      throw new Error(
        "Email is required to create a user account. Please ensure your login method provides an email address."
      );
    }

    user = await UserModel.create({
      uid,
      email,
      name,
    });

    return user;
  } catch (error: any) {
    console.error("Error in findOrCreateUserByFirebase:", error);

    if (error.code === "P2002") {
      throw new Error("An account with this email already exists.");
    }

    throw new Error("Could not save user to database: " + error.message);
  }
};
