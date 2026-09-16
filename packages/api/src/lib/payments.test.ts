import { describe, expect, it } from "vitest";

import type { Payments } from "./payments";
import { getPayments, setPayments } from "./payments";

const mockPayments: Payments = {
  ensureCustomer: async () => "cus_test",
  createSetupIntent: async () => ({ clientSecret: "seti_secret" }),
  retrieveCard: async (id) => ({
    stripePaymentMethodId: id,
    customerId: "cus_test",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2030,
  }),
  createHold: async () => ({ paymentIntentId: "pi_test" }),
};

describe("payments", () => {
  it("uses an injected mock instead of Stripe", async () => {
    setPayments(mockPayments);
    const payments = getPayments();
    await expect(
      payments.createHold({
        customerId: "cus_test",
        stripePaymentMethodId: "pm_test",
        amountCents: 2500,
        currency: "EUR",
        actionId: "action_1",
      }),
    ).resolves.toEqual({ paymentIntentId: "pi_test" });
    setPayments(undefined);
  });
});
