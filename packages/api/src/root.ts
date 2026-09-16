import { authRouter } from "./router/auth";
import { billingRouter } from "./router/billing";
import { charityRouter } from "./router/charity";
import { commitmentRouter } from "./router/commitment";
import { friendRouter } from "./router/friend";
import { invitationRouter } from "./router/invitation";
import { onboardingRouter } from "./router/onboarding";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  billing: billingRouter,
  charity: charityRouter,
  commitment: commitmentRouter,
  friend: friendRouter,
  invitation: invitationRouter,
  onboarding: onboardingRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
