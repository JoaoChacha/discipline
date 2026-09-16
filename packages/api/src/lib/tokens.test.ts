import { describe, expect, it } from "vitest";

import { createInviteToken, hashInviteToken, inviteUrls } from "./tokens";

describe("invite tokens", () => {
  it("hashes the plaintext token", () => {
    const { token, tokenHash } = createInviteToken();
    expect(tokenHash).toBe(hashInviteToken(token));
    expect(token).not.toBe(tokenHash);
  });

  it("builds https and app share links", () => {
    expect(inviteUrls("abc", "https://discipline.example/")).toEqual({
      https: "https://discipline.example/i/abc",
      app: "discipline://i/abc",
    });
  });
});
