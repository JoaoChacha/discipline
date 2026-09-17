import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  applyPaymentIntentStatus,
  upsertPaymentMethodFromStripe,
} from "@discipline/api";
import { db } from "@discipline/db/client";

import { env } from "~/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "setup_intent.succeeded": {
      const intent = event.data.object;
      const paymentMethodId =
        typeof intent.payment_method === "string"
          ? intent.payment_method
          : intent.payment_method?.id;
      if (paymentMethodId) {
        await upsertPaymentMethodFromStripe(db, paymentMethodId);
      }
      break;
    }
    case "payment_method.attached": {
      await upsertPaymentMethodFromStripe(db, event.data.object.id);
      break;
    }
    case "payment_intent.amount_capturable_updated": {
      await applyPaymentIntentStatus(db, event.data.object.id, "authorized");
      break;
    }
    case "payment_intent.canceled": {
      await applyPaymentIntentStatus(db, event.data.object.id, "canceled");
      break;
    }
    case "payment_intent.payment_failed": {
      await applyPaymentIntentStatus(db, event.data.object.id, "failed");
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
