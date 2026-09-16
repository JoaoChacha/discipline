import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@discipline/ui/button";

import { auth, getSession } from "~/auth/server";

async function signIn(provider: "apple" | "google") {
  "use server";
  const res = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/",
    },
  });
  if (!res.url) {
    throw new Error("No URL returned from signInSocial");
  }
  redirect(res.url);
}

export async function AuthShowcase() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-3">
        <form action={signIn.bind(null, "apple")}>
          <Button size="lg">Sign in with Apple</Button>
        </form>
        <form action={signIn.bind(null, "google")}>
          <Button size="lg" variant="outline">
            Sign in with Google
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
