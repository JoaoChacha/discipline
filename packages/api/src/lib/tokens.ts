import { createHash, randomBytes } from "node:crypto";

export function createInviteToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashInviteToken(token) };
}

export function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function inviteUrls(
  token: string,
  appUrl: string,
  scheme = process.env.APP_SCHEME ?? "discipline",
) {
  const origin = appUrl.replace(/\/$/, "");
  return {
    https: `${origin}/i/${token}`,
    app: `${scheme}://i/${token}`,
  };
}

export function inviteExpiry(from = new Date(), days = 14) {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}
