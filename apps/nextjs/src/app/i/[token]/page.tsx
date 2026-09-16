import { AuthShowcase } from "../../_components/auth-showcase";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">
        You were invited
      </h1>
      <p className="text-muted-foreground max-w-md text-center">
        Sign in with Apple or Google, then open this link in Discipline to
        become a verifier.
      </p>
      <p className="font-mono text-sm break-all">{token}</p>
      <AuthShowcase />
    </main>
  );
}
