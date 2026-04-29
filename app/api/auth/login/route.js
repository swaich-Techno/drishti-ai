import { NextResponse } from "next/server";
import { createUserSession, verifyPassword } from "@/lib/auth";
import { findUserForAuthByEmail } from "@/lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await findUserForAuthByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    await createUserSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Could not log in right now." }, { status: 500 });
  }
}
