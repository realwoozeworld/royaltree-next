import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE_NAME = "royaltree_admin_session";
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

// In-memory rate limiting map for admin login attempts
interface RateLimitRecord {
  failedAttempts: number;
  lockedUntil: number | null;
}

// Global declaration ensures the map persists across hot-reloads in Node runtime
const globalForAuth = globalThis as unknown as {
  adminLoginRateLimits?: Map<string, RateLimitRecord>;
};

const loginRateLimits =
  globalForAuth.adminLoginRateLimits ?? new Map<string, RateLimitRecord>();

if (!globalForAuth.adminLoginRateLimits) {
  globalForAuth.adminLoginRateLimits = loginRateLimits;
}

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.RESEND_API_KEY ||
    "royaltree-secure-fallback-secret-2026-paulownia"
  );
}

function signSession(email: string, expiresAt: number): string {
  const secret = getSecret();
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString(
    "base64url"
  );
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function verifySession(token: string): { email: string } | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const secret = getSecret();
    const expectedSig = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSig, "hex");

    if (
      sigBuf.length !== expBuf.length ||
      !timingSafeEqual(sigBuf, expBuf)
    ) {
      return null;
    }

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (!data.email || typeof data.expiresAt !== "number") return null;

    if (Date.now() > data.expiresAt) {
      return null;
    }

    return { email: data.email };
  } catch {
    return null;
  }
}

/**
 * Verifies that the incoming request has a valid admin session.
 * Used at the top of every mutating Server Action.
 */
export async function checkAdminAuth(): Promise<{
  authorized: boolean;
  email?: string;
  error?: string;
}> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return {
      authorized: false,
      error: "ავტორიზაცია არ არის გავლილი. გთხოვთ გაიაროთ ავტორიზაცია.",
    };
  }

  const session = verifySession(sessionCookie);
  if (!session) {
    return {
      authorized: false,
      error: "სესიის ვადა ამოიწურა ან არავალიდურია. გთხოვთ თავიდან შეხვიდეთ.",
    };
  }

  return { authorized: true, email: session.email };
}

/**
 * Sets an httpOnly, secure, sameSite: strict session cookie.
 */
export async function setAdminSessionCookie(email: string): Promise<void> {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = signSession(email, expiresAt);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Removes the admin session cookie.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Login rate limiting check:
 * After 5 failed password attempts, locks attempts for 15 minutes and returns
 * a clear Georgian error message with remaining minutes.
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  message?: string;
} {
  const now = Date.now();
  const record = loginRateLimits.get(identifier);

  if (record && record.lockedUntil && record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return {
      allowed: false,
      message: `ზედიზედ 5 წარუმატებელი მცდელობის გამო სისტემა დაბლოკილია. გთხოვთ სცადოთ ${remainingMinutes} წუთში.`,
    };
  }

  return { allowed: true };
}

export function recordFailedLogin(identifier: string): {
  isLocked: boolean;
  message: string;
} {
  const now = Date.now();
  const record = loginRateLimits.get(identifier) || {
    failedAttempts: 0,
    lockedUntil: null,
  };

  // If previous lockout expired, reset attempts
  if (record.lockedUntil && record.lockedUntil <= now) {
    record.failedAttempts = 0;
    record.lockedUntil = null;
  }

  record.failedAttempts += 1;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    loginRateLimits.set(identifier, record);
    return {
      isLocked: true,
      message: `ზედიზედ 5 წარუმატებელი მცდელობის გამო სისტემა დაიბლოკა 15 წუთით. გთხოვთ სცადოთ 15 წუთში.`,
    };
  }

  loginRateLimits.set(identifier, record);
  const remaining = MAX_FAILED_ATTEMPTS - record.failedAttempts;
  return {
    isLocked: false,
    message: `არასწორი პაროლი ან მონაცემები. დარჩენილია ${remaining} მცდელობა.`,
  };
}

export function recordSuccessfulLogin(identifier: string): void {
  loginRateLimits.delete(identifier);
}
