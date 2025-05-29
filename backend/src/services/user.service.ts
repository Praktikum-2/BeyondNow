import prisma from "../db";

export const findOrCreateUserByFirebase = async (
  uid: string,
  email: string | undefined,
  name?: string
) => {
  console.log("=== USER SERVICE ===");
  console.log("Input params:", { uid, email, name });

  try {
    console.log("🔄 Checking if user exists with UID:", uid);
    let user = await prisma.user.findUnique({
      where: { uid: uid },
    });
    console.log("Existing user found:", !!user);

    if (user) {
      console.log("✅ User exists, checking for updates...");
      if (email && user.email !== email) {
        console.log("🔄 Updating user email...");
        user = await prisma.user.update({
          where: { uid: uid },
          data: { email: email },
        });
        console.log("✅ User email updated");
      }
      return user;
    }

    console.log("🔄 Creating new user...");
    if (!email) {
      console.log("❌ No email provided for new user");
      throw new Error(
        "Email is required to create a user account. Please ensure your login method provides an email address."
      );
    }

    user = await prisma.user.create({
      data: {
        uid: uid,
        email: email,
        name: name || null,
        organization: undefined,
      },
    });

    console.log("✅ New user created:", user);
    return user;
  } catch (error: any) {
    console.error("❌ Error in findOrCreateUserByFirebase:", error);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    if (error.code === "P2002") {
      console.log("❌ Unique constraint violation");
      throw new Error("An account with this email already exists.");
    }

    throw new Error("Could not save user to database: " + error.message);
  }
};
