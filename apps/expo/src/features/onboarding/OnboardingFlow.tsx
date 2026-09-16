import { useEffect, useState } from "react";
import { AccessibilityInfo, Text } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import { useTheme } from "~/theme/ThemeProvider";
import { PhoneFrame } from "~/ui/PhoneFrame";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { authClient } from "~/utils/auth";
import { OnboardingShell } from "./components/Shell";
import {
  LAST_STEP,
  OnboardingProvider,
  useOnboarding,
  WELCOME_STEP,
} from "./OnboardingProvider";
import { getOnboardingSnapshot } from "./onboardingStore";
import { CharitiesScreen } from "./screens/CharitiesScreen";
import { ConsentScreen } from "./screens/ConsentScreen";
import { MoneyScreen } from "./screens/MoneyScreen";
import { PrivacyScreen } from "./screens/PrivacyScreen";
import { PromiseScreen } from "./screens/PromiseScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { useOnboardingGate } from "./useOnboardingGate";

const TOTAL_STEPS = 5;

const STEP_CTA = [
  "See how the stake works",
  "See charity choices",
  "I understand",
  "Review and begin",
  "Create my first commitment",
] as const;

function StepContent({
  step,
  reduceMotion,
}: {
  step: number;
  reduceMotion: boolean;
}) {
  switch (step) {
    case 1:
      return <PromiseScreen reduceMotion={reduceMotion} />;
    case 2:
      return <MoneyScreen reduceMotion={reduceMotion} />;
    case 3:
      return <CharitiesScreen reduceMotion={reduceMotion} />;
    case 4:
      return <PrivacyScreen reduceMotion={reduceMotion} />;
    default:
      return <ConsentScreen reduceMotion={reduceMotion} />;
  }
}

function OnboardingStepper() {
  const router = useRouter();
  const { type, motion } = useTheme();
  const { data: session } = authClient.useSession();
  const { step, next, back, skip, consented, stashConsent, complete } =
    useOnboarding();
  const { ready, needsOnboarding, clearPreview } = useOnboardingGate();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!ready || !session || needsOnboarding) return;
    if (step !== WELCOME_STEP) return;
    router.replace("/");
  }, [needsOnboarding, ready, router, session, step]);

  const goForward = () => {
    setDirection(1);
    next();
  };

  const goBack = () => {
    setDirection(-1);
    back();
  };

  const goSkip = () => {
    setDirection(1);
    skip();
  };

  const finishSignedIn = async () => {
    setFinishing(true);
    try {
      const preview = getOnboardingSnapshot().preview === true;
      await complete();
      await clearPreview();
      router.replace(preview ? "/" : "/commitment/new?first=1");
    } finally {
      setFinishing(false);
    }
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

  if (step === WELCOME_STEP) {
    return (
      <WelcomeScreen
        reduceMotion={reduceMotion}
        onStart={() => {
          setDirection(1);
          next();
        }}
        onSignIn={() => {
          if (session) {
            void finishSignedIn();
            return;
          }
          router.push("/login");
        }}
      />
    );
  }

  return (
    <OnboardingShell
      step={step}
      total={TOTAL_STEPS}
      reduceMotion={reduceMotion}
      leading="back"
      onLeading={goBack}
      onSkip={step === LAST_STEP ? undefined : goSkip}
      ctaLabel={STEP_CTA[step - 1] ?? STEP_CTA[0]}
      ctaDisabled={(step === LAST_STEP && !consented) || finishing}
      ctaTestID="onboarding-cta"
      footer={
        step === LAST_STEP ? (
          <Text
            style={{
              ...type.footnote,
              marginTop: 8,
            }}
          >
            No money is held until you confirm a commitment.
          </Text>
        ) : null
      }
      onCta={() => {
        if (step === LAST_STEP) {
          if (session) {
            void finishSignedIn();
            return;
          }
          void stashConsent().then(() => {
            router.push("/create-account");
          });
          return;
        }
        goForward();
      }}
    >
      <Animated.View
        key={step}
        entering={entering}
        style={{ flex: 1, minHeight: 0 }}
      >
        <ScreenScroll>
          <StepContent step={step} reduceMotion={reduceMotion} />
        </ScreenScroll>
      </Animated.View>
    </OnboardingShell>
  );
}

export function OnboardingFlow() {
  return (
    <OnboardingProvider>
      <PhoneFrame>
        <OnboardingStepper />
      </PhoneFrame>
    </OnboardingProvider>
  );
}
