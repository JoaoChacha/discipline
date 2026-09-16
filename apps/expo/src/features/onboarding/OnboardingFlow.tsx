import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AccessibilityInfo, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import { useTheme } from "~/theme/ThemeProvider";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { authClient } from "~/utils/auth";
import { OnboardingShell } from "./components/Shell";
import {
  LAST_STEP,
  OnboardingProvider,
  useOnboarding,
  WELCOME_STEP,
} from "./OnboardingProvider";
import { CharitiesScreen } from "./screens/CharitiesScreen";
import { ConsentScreen } from "./screens/ConsentScreen";
import { MoneyScreen } from "./screens/MoneyScreen";
import { PrivacyScreen } from "./screens/PrivacyScreen";
import { PromiseScreen } from "./screens/PromiseScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";

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
  const { step, next, back, skip, consented, complete } = useOnboarding();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

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

  const finish = async () => {
    await complete();
    router.replace("/");
  };

  const signIn = async () => {
    if (session) {
      await finish();
      return;
    }

    setSigningIn(true);
    try {
      await complete();
      await authClient.signIn.social({
        provider: "discord",
        callbackURL: "/",
      });
    } finally {
      setSigningIn(false);
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
        signingIn={signingIn}
        onStart={() => {
          setDirection(1);
          next();
        }}
        onSignIn={() => {
          void signIn();
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
      ctaDisabled={step === LAST_STEP && !consented}
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
          void finish();
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

function PhoneFrame({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.canvas,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 390,
          minHeight: 0,
          backgroundColor: colors.field,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
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
