export async function register() {
  // Next sets NEXT_RUNTIME during instrumentation; it is not an app secret.
  // eslint-disable-next-line no-restricted-properties, turbo/no-undeclared-env-vars -- Next.js instrumentation hook
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./src/ws");
  }
}
