import { createCookieSessionStorage, redirect } from 'solid-start';

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

async function getUserId(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");
  return userId;
}

async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

async function logIn(request: Request, userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return new Response("Signed Up", {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}
