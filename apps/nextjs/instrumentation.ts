export async function register() {
  // Next sets NEXT_RUNTIME during instrumentation; it is not an app secret.
  // eslint-disable-next-line no-restricted-properties, turbo/no-undeclared-env-vars -- Next.js instrumentation hook
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // Serverless hosts cannot bind a long-lived WebSocket port.
  // eslint-disable-next-line no-restricted-properties -- Vercel injects this host flag
  if (process.env.VERCEL) return;
  await import("./src/ws");
}
