import { auth0 } from "./auth0";
import prisma from "./prisma";

export async function getOrCreateUser() {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { auth0Id: session.user.sub },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        auth0Id: session.user.sub,
        email: session.user.email!,
        name: session.user.name,
      },
    });
  }

  return user;
}
