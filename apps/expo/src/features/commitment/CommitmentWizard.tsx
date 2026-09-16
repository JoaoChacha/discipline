import { useEffect, useState } from "react";
import { AccessibilityInfo, Text } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";

import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { OnboardingShell } from "~/features/onboarding/components/Shell";
import { useOnboardingGate } from "~/features/onboarding/useOnboardingGate";
import { useTheme } from "~/theme/ThemeProvider";
import { PhoneFrame } from "~/ui/PhoneFrame";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { ScreenWash } from "~/ui/ScreenWash";
import { queryClient, trpc } from "~/utils/api";
import {
  CommitmentProvider,
  LAST_STEP,
  useCommitment,
} from "./CommitmentProvider";
import { formatEuro } from "./format";
import { ActionScreen } from "./screens/ActionScreen";
import { CauseScreen } from "./screens/CauseScreen";
import { HeldScreen } from "./screens/HeldScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { StakeScreen } from "./screens/StakeScreen";
import { VerifierScreen } from "./screens/VerifierScreen";

const TOTAL_STEPS = 5;

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <ActionScreen />;
    case 2:
      return <StakeScreen />;
    case 3:
      return <CauseScreen />;
    case 4:
      return <VerifierScreen />;
    default:
      return <ReviewScreen />;
  }
}

function WizardStepper() {
  const router = useRouter();
  const params = useLocalSearchParams<{ first?: string }>();
  const first = params.first === "1";
  const { type, motion } = useTheme();
  const { ready, needsOnboarding } = useOnboardingGate();
  const {
    step,
    next,
    back,
    title,
    dueAt,
    amountCents,
    causes,
    friend,
    pendingInvite,
    inviteName,
    inviteEmail,
    paymentKind,
    canAdvance,
    submitting,
    setSubmitting,
    setPendingInvite,
    setFriend,
  } = useCommitment();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const [held, setHeld] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvite = useMutation(
    trpc.invitation.createEmail.mutationOptions(),
  );
  const createCommitment = useMutation(
    trpc.commitment.create.mutationOptions(),
  );

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (ready && needsOnboarding) {
      router.replace("/");
    }
  }, [needsOnboarding, ready, router]);

  const goForward = () => {
    setDirection(1);
    next();
  };

  const goBack = () => {
    setError(null);
    if (step === 1) {
      router.replace("/");
      return;
    }
    setDirection(-1);
    back();
  };

  const confirm = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createCommitment.mutateAsync({
        title: title.trim(),
        dueAt,
        amountCents,
        currency: "EUR",
        verifierId: friend?.id,
        invitationId: friend ? undefined : pendingInvite?.id,
        causes,
        paymentKind,
        consented: true,
        termsVersion: CURRENT_TERMS_VERSION,
      });
      await queryClient.invalidateQueries();
      setHeld(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCta = async () => {
    setError(null);
    if (step === 4 && !friend && !pendingInvite) {
      setSubmitting(true);
      try {
        const invite = await createInvite.mutateAsync({
          displayName: inviteName,
          email: inviteEmail,
        });
        setFriend(null);
        setPendingInvite({
          id: invite.id,
          displayName: invite.displayName ?? inviteName,
          email: invite.email ?? inviteEmail,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send invite.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (step === LAST_STEP) {
      await confirm();
      return;
    }
    goForward();
  };

  const entering = reduceMotion
    ? undefined
    : direction > 0
      ? FadeInRight.duration(motion.duration).easing(
          Easing.bezier(...motion.easing),
        )
      : FadeInLeft.duration(motion.duration).easing(
          Easing.bezier(...motion.easing),
        );

  if (held) {
    return (
      <ScreenWash>
        <HeldScreen
          first={first}
          title={title}
          amountCents={amountCents}
          verifierName={
            friend?.name ?? pendingInvite?.displayName ?? "your verifier"
          }
          pending={!friend}
          onDone={() => router.replace("/")}
        />
      </ScreenWash>
    );
  }

  const ctaLabel =
    step === 1
      ? "Set the stake"
      : step === 2
        ? "Choose a cause"
        : step === 3
          ? "Choose a verifier"
          : step === 4
            ? friend || pendingInvite
              ? "Review and confirm"
              : "Send invite"
            : paymentKind === "apple_pay"
              ? "Confirm with Apple Pay"
              : `Confirm and hold ${formatEuro(amountCents)}`;

  return (
    <OnboardingShell
      step={step}
      total={TOTAL_STEPS}
      reduceMotion={reduceMotion}
      leading={step === 1 ? "close" : "back"}
      onLeading={goBack}
      ctaLabel={submitting ? "Working…" : ctaLabel}
      ctaDisabled={!canAdvance || submitting}
      ctaTestID="commitment-cta"
      footer={
        <>
          {error ? (
            <Text style={{ ...type.footnote, color: "#B42318", marginTop: 8 }}>
              {error}
            </Text>
          ) : (
            <Text style={{ ...type.footnote, marginTop: 8 }}>
              {step === LAST_STEP && pendingInvite
                ? `Your stake is held once ${pendingInvite.displayName} accepts the invite.`
                : "No money is held until you confirm."}
            </Text>
          )}
        </>
      }
      onCta={() => {
        void handleCta();
      }}
    >
      <Animated.View
        key={step}
        entering={entering}
        style={{ flex: 1, minHeight: 0 }}
      >
        <ScreenScroll>
          <StepContent step={step} />
        </ScreenScroll>
      </Animated.View>
    </OnboardingShell>
  );
}

export function CommitmentWizard() {
  return (
    <CommitmentProvider>
      <PhoneFrame>
        <WizardStepper />
      </PhoneFrame>
    </CommitmentProvider>
  );
}
