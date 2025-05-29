import prisma from "../db";

export const findOrCreateUserByFirebase = async (
  uid: string,
  email: string | undefined
) => {
  if (!email) {
    // Firebase users might not always have an email (e.g., phone auth)
    // Decide how to handle this case. For now, we'll throw an error if email is essential for your User model.
    // If your User model allows nullable email, adjust accordingly.
    // The provided schema has email as non-nullable and unique.
    throw new Error("Email is required to create or find a user.");
  }

  try {
    const user = await prisma.user.upsert({
      where: { uid: uid },
      update: { email: email },
      create: {
        uid: uid,
        email: email,
        organization: undefined,
      },
    });
    return user;
  } catch (error) {
    console.error("Error in findOrCreateUserByFirebase:", error);
    throw new Error("Could not save user to database.");
  }
};
