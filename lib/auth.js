import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import {
  createSessionRecord,
  deleteSessionRecord,
  findUserBySessionToken,
} from "@/lib/store";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "drishti_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedValue) {
  const [salt, storedHash] = String(storedValue || "").split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = scryptSync(password, salt, 64);
  const originalHash = Buffer.from(storedHash, "hex");

  if (candidateHash.length !== originalHash.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, originalHash);
}

export async function createUserSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await createSessionRecord({
    userId,
    token,
    expiresAt,
  });

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    expires: expiresAt,
  });
}

export async function clearUserSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSessionRecord(token);
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return findUserBySessionToken(token);
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    const error = new Error("Unauthorized");
    error.code = "UNAUTHORIZED";
    throw error;
  }

  return user;
}

export function isUnauthorizedError(error) {
  return error?.code === "UNAUTHORIZED";
}
