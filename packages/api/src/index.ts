import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";

/**
 * Inference helpers for input types
 * @example
 * type SessionInput = RouterInputs['auth']['getSession']
 */
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type SessionOutput = RouterOutputs['auth']['getSession']
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { type AppRouter, appRouter } from "./root";
export { createTRPCContext } from "./trpc";
export { startWsServer } from "./ws";
export { setPayments, getPayments } from "./lib/payments";
export {
  applyPaymentIntentStatus,
  upsertPaymentMethodFromStripe,
} from "./lib/stripe-webhook";
export { events } from "./lib/events";
export type { RouterInputs, RouterOutputs };
