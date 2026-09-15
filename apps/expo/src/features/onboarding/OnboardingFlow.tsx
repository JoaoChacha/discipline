import { useEffect, useState } from "react";
import { AccessibilityInfo, Pressable, ScrollView, Text } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import { colors, motion } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { authClient } from "~/utils/auth";
import { OnboardingIcon } from "./components/OnboardingIcon";
import { OnboardingShell } from "./components/Shell";
import {
  FIRST_STEP,
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
  "Continue",
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
  const { data: session } = authClient.useSession();
  const { step, next, back, skip, replay, consented, complete } =
    useOnboarding();
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

  const exiting = reduceMotion
    ? undefined
    : direction > 0
      ? FadeOutLeft.duration(motion.duration).easing(
          Easing.bezier(...motion.easing),
        )
      : FadeOutRight.duration(motion.duration).easing(
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
      leading={step === FIRST_STEP ? "close" : "back"}
      onLeading={goBack}
      onSkip={step === LAST_STEP ? undefined : goSkip}
      ctaLabel={STEP_CTA[step - 1] ?? STEP_CTA[0]}
      ctaDisabled={step === LAST_STEP && !consented}
      ctaTestID="onboarding-cta"
      footer={
        step === LAST_STEP ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Replay onboarding"
            onPress={() => {
              setDirection(-1);
              replay();
            }}
            testID="onboarding-replay"
            style={{
              marginTop: 4,
              minHeight: 44,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <OnboardingIcon
              name="refresh"
              size={16}
              color={colors.secondaryLabel}
            />
            <Text style={{ ...type.footnote, fontWeight: "600" }}>
              Replay onboarding
            </Text>
          </Pressable>
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
        exiting={exiting}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        >
          <StepContent step={step} reduceMotion={reduceMotion} />
        </ScrollView>
      </Animated.View>
    </OnboardingShell>
  );
}

export function OnboardingFlow() {
  return (
    <OnboardingProvider>
      <OnboardingStepper />
    </OnboardingProvider>
  );
}
