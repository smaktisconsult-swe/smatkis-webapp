import { createHash, createHmac, pbkdf2Sync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "smaktis_admin_session";
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const DEFAULT_ADMIN_EMAIL = "smaktisconsult@gmail.com";

export type AdminSession = {
  email: string;
};

function safeCompare(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftHash, rightHash);
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || DEFAULT_ADMIN_EMAIL;
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD_HASH ||
    process.env.ADMIN_PASSWORD ||
    ""
  );
}

function signSession(email: string, expiresAt: number) {
  return createHmac("sha256", getSessionSecret())
    .update(`${email}.${expiresAt}`)
    .digest("base64url");
}

function verifyPasswordHash(password: string, configuredHash: string) {
  const [algorithm, iterations, salt, storedHash] = configuredHash.split("$");

  if (algorithm !== "pbkdf2_sha256" || !iterations || !salt || !storedHash) {
    return false;
  }

  const iterationCount = Number(iterations);

  if (!Number.isInteger(iterationCount) || iterationCount < 100000) {
    return false;
  }

  const derivedHash = pbkdf2Sync(
    password,
    salt,
    iterationCount,
    32,
    "sha256"
  ).toString("base64url");

  return safeCompare(derivedHash, storedHash);
}

export function isAdminAuthConfigured() {
  return Boolean(
    getSessionSecret() &&
      (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD)
  );
}

export function getConfiguredAdminEmail() {
  return getAdminEmail();
}

export async function verifyAdminCredentials(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isAdminAuthConfigured() || normalizedEmail !== getAdminEmail()) {
    return false;
  }

  const configuredHash = process.env.ADMIN_PASSWORD_HASH;

  if (configuredHash) {
    return verifyPasswordHash(password, configuredHash);
  }

  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";

  return safeCompare(password, configuredPassword);
}

export async function createAdminSession(email: string) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const encodedEmail = Buffer.from(email.trim().toLowerCase()).toString("base64url");
  const signature = signSession(email.trim().toLowerCase(), expiresAt);

  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    `${encodedEmail}.${expiresAt}.${signature}`,
    {
      httpOnly: true,
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  );
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  const [encodedEmail, expiresAtValue, signature] = value.split(".");
  const expiresAt = Number(expiresAtValue);

  if (!encodedEmail || !signature || !Number.isFinite(expiresAt)) {
    return null;
  }

  if (Date.now() > expiresAt) {
    return null;
  }

  const email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  const expectedSignature = signSession(email, expiresAt);

  if (!safeCompare(signature, expectedSignature) || email !== getAdminEmail()) {
    return null;
  }

  return { email };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin?auth=required");
  }

  return session;
}
