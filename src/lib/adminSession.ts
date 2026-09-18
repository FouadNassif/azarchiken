// Stateless signed-cookie session — no database needed. The cookie value is
// `<expiryMs>.<hmac>`; verifying just recomputes the HMAC and checks it
// matches and hasn't expired. Requires ADMIN_SESSION_SECRET and
// ADMIN_PASSWORD env vars.
import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "azar_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET is not set");
  return value;
}

function sign(expiry: number): string {
  return createHmac("sha256", secret()).update(String(expiry)).digest("hex");
}

export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_DURATION_MS;
  return `${expiry}.${sign(expiry)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryStr, signature] = token.split(".");
  const expiry = Number(expiryStr);
  if (!expiry || !signature || Date.now() > expiry) return false;

  const expected = sign(expiry);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(candidate: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}
