import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@discipline/ui/button";

import { auth, getSession } from "~/auth/server";
import { env } from "~/env";

function isConfigured(value: string | undefined) {
  return Boolean(value && value !== "replace-me");
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function AuthShowcase() {
  const session = await getSession();
  const googleEnabled = isConfigured(env.AUTH_GOOGLE_ID);

  if (!session) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        {googleEnabled ? (
          <form>
            <Button
              size="lg"
              className="w-full"
              formAction={async () => {
                "use server";
                const res = await auth.api.signInSocial({
                  body: {
                    provider: "google",
                    callbackURL: "/",
                  },
                });
                if (!res.url) {
                  throw new Error("No URL returned from signInSocial");
                }
                redirect(res.url);
              }}
            >
              Continue with Google
            </Button>
          </form>
        ) : null}

        <form className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Name"
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          />
          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          />
          <input
            required
            name="password"
            type="password"
            minLength={8}
            placeholder="Password (8+ characters)"
            className="border-input bg-background h-10 rounded-md border px-3 text-sm"
          />
          <Button
            size="lg"
            formAction={async (formData) => {
              "use server";
              const email = formString(formData, "email");
              const password = formString(formData, "password");
              await auth.api.signInEmail({
                body: { email, password },
              });
              redirect("/");
            }}
          >
            Sign in with email
          </Button>
          <Button
            size="lg"
            variant="outline"
            formAction={async (formData) => {
              "use server";
              const name = formString(formData, "name").trim() || "Discipline";
              const email = formString(formData, "email");
              const password = formString(formData, "password");
              await auth.api.signUpEmail({
                body: { name, email, password },
              });
              redirect("/");
            }}
          >
            Create account
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
