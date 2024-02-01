import bcrypt from "bcryptjs";

// If you do not use function inside User schema to hash password before add to the db
// Use this one, adding it to register function, inside User.create({ password: hasshedPassword })
export async function hashUserPassword(
  password: string
): Promise<string | undefined> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
}
