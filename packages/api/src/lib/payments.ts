import Stripe from "stripe";

export interface CardDetails {
  stripePaymentMethodId: string;
  customerId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface Payments {
  ensureCustomer(input: {
    userId: string;
    email: string;
    name: string;
  }): Promise<string>;
  createSetupIntent(
    customerId: string,
  ): Promise<{ clientSecret: string | null }>;
  retrieveCard(stripePaymentMethodId: string): Promise<CardDetails>;
  createHold(input: {
    customerId: string;
    stripePaymentMethodId: string;
    amountCents: number;
    currency: string;
    actionId: string;
  }): Promise<{ paymentIntentId: string }>;
}

export class StripePayments implements Payments {
  constructor(private readonly stripe: Stripe) {}

  async ensureCustomer(input: { userId: string; email: string; name: string }) {
    const existing = await this.stripe.customers.search({
      query: `metadata["userId"]:"${input.userId}"`,
      limit: 1,
    });
    if (existing.data[0]) return existing.data[0].id;

    const customer = await this.stripe.customers.create({
      email: input.email,
      name: input.name,
      metadata: { userId: input.userId },
    });
    return customer.id;
  }

  async createSetupIntent(customerId: string) {
    const intent = await this.stripe.setupIntents.create({
      customer: customerId,
      usage: "off_session",
      payment_method_types: ["card"],
    });
    return { clientSecret: intent.client_secret };
  }

  async retrieveCard(stripePaymentMethodId: string) {
    const method = await this.stripe.paymentMethods.retrieve(
      stripePaymentMethodId,
    );
    const customerId =
      typeof method.customer === "string"
        ? method.customer
        : (method.customer?.id ?? "");
    return {
      stripePaymentMethodId: method.id,
      customerId,
      brand: method.card?.brand ?? "card",
      last4: method.card?.last4 ?? "0000",
      expMonth: method.card?.exp_month ?? 1,
      expYear: method.card?.exp_year ?? 2099,
    };
  }

  async createHold(input: {
    customerId: string;
    stripePaymentMethodId: string;
    amountCents: number;
    currency: string;
    actionId: string;
  }) {
    const intent = await this.stripe.paymentIntents.create({
      amount: input.amountCents,
      currency: input.currency.toLowerCase(),
      customer: input.customerId,
      payment_method: input.stripePaymentMethodId,
      capture_method: "manual",
      confirm: true,
      off_session: true,
      metadata: { actionId: input.actionId },
    });
    return { paymentIntentId: intent.id };
  }
}

export function createStripePayments(
  secretKey = process.env.STRIPE_SECRET_KEY,
) {
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new StripePayments(new Stripe(secretKey));
}

let payments: Payments | undefined;

export function getPayments() {
  payments ??= createStripePayments();
  return payments;
}

export function setPayments(next: Payments | undefined) {
  payments = next;
}
