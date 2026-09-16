import { describe, expect, it } from "vitest";

import { createInviteToken, hashInviteToken, inviteUrls } from "./tokens";

describe("link invites", () => {
  it("never puts the raw token in the stored hash", () => {
    const { token, tokenHash } = createInviteToken();
    expect(tokenHash).toHaveLength(64);
    expect(hashInviteToken(token)).toBe(tokenHash);
    expect(token.includes(tokenHash)).toBe(false);
  });

  it("returns shareable https and app URLs", () => {
    const urls = inviteUrls("token_value", "http://localhost:3000");
    expect(urls.https).toBe("http://localhost:3000/i/token_value");
    expect(urls.app).toBe("discipline://i/token_value");
  });
});
