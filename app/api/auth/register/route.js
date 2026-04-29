import { NextResponse } from "next/server";
import { createUserSession, hashPassword } from "@/lib/auth";
import {
  createUser,
  findUserForAuthByEmail,
  isProductionPersistenceMisconfigured,
  PERSISTENCE_REQUIRED_MESSAGE,
} from "@/lib/store";

export async function POST(request) {
  try {
    if (isProductionPersistenceMisconfigured()) {
      return NextResponse.json({ error: PERSISTENCE_REQUIRED_MESSAGE }, { status: 503 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existingUser = await findUserForAuthByEmail(email);

    if (existingUser) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const user = await createUser({
      name,
      email,
      passwordHash: hashPassword(password),
    });

    await createUserSession(user.id);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Could not create the account right now." }, { status: 500 });
  }
}
