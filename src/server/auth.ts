import { UserRole } from '@prisma/client';
import { ServerError, createCookieSessionStorage, redirect } from 'solid-start';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { prisma } from "~/util/prisma";
import bcrypt from "bcryptjs";

export const registerSchema = zfd.formData({
  userName: zfd.text(),
  password: zfd.text(),
  password2: zfd.text(),
  firstName: zfd.text(),
  lastName: zfd.text(),
});

export type RegisterForm = z.infer<typeof registerSchema>;

export const register = async (data: RegisterForm) => {
  const userExists = await prisma.user.findUnique({
    where: {
      userName: data.userName
    }
  });

  if (userExists) {
    throw new ServerError("user-exists");
  }

  const hasshedPassowrd = await bcrypt.hash(data.password, 8);

  const user = await prisma.user.create({
    data: {
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      password: hasshedPassowrd,
      role: UserRole.USER
    }
  });

  return logIn(user.id);
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET ?? ""],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true
  }
});

export async function getUserId(request: Request): Promise<string> {
  const session = await storage.getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  return userId;
}

export const getUserData = async (request: Request): Promise<{ firstName: string, lastName: string, userName: string }> => {
  const userId = await getUserId(request);

  if (!userId) {
    // @ts-expect-error redirect
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      firstName: true,
      lastName: true,
      userName: true,
    }
  });

  if (!user) {
    // @ts-expect-error redirect
    return redirect("/login");
  }

  return user;
}

export const isUserLoggedIn = async (request: Request) => {
  const userId = await getUserId(request);
  return userId !== null;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

export const logInSchema = zfd.formData({
  userName: zfd.text(),
  password: zfd.text()
});
export type LogInForm = z.infer<typeof logInSchema>;

export const logInAction = async (data: LogInForm) => {
  const user = await prisma.user.findUnique({
    where: {
      userName: data.userName
    },
    select: {
      id: true,
      password: true
    }
  });

  if (!user) {
    throw new ServerError("incorrect");
  }

  const isCorrect = await bcrypt.compare(data.password, user.password);
  if (!isCorrect) {
    throw new ServerError("incorrect");
  }

  return logIn(user.id);

}

async function logIn(userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}

export const isAdmin = async (request: Request) => {
  const userId = await getUserId(request);
  if (!userId) {
    return false;
  }

  const role = await prisma.user.findUnique({
    where: {
      id: userId
    },

    select: {
      role: true
    }
  });

  return role?.role === UserRole.ADMIN;
}
