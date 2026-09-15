import { useEffect, useState } from "react";
import { AccessibilityInfo, ScrollView } from "react-native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import { colors, motion } from "~/theme/tokens";
import { OnboardingShell } from "./components/Shell";
import { OnboardingProvider, useOnboarding } from "./OnboardingProvider";
import { CharitiesScreen } from "./screens/CharitiesScreen";
import { ConsentScreen } from "./screens/ConsentScreen";
import { MoneyScreen } from "./screens/MoneyScreen";
import { PrivacyScreen } from "./screens/PrivacyScreen";
import { PromiseScreen } from "./screens/PromiseScreen";

const TOTAL_STEPS = 5;

const STEP_CTA = [
  "See how the stake works",
  "Choose my charities",
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
  const { step, next, back, skip, consented, complete, dismiss } =
    useOnboarding();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [direction, setDirection] = useState(1);

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

  const finish = async (kind: "complete" | "dismiss") => {
    if (kind === "complete") {
      await complete();
    } else {
      await dismiss();
    }
    router.replace("/");
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

  return (
    <OnboardingShell
      step={step}
      total={TOTAL_STEPS}
      reduceMotion={reduceMotion}
      onClose={step === 1 ? () => void finish("dismiss") : undefined}
      onBack={step === 1 ? undefined : goBack}
      onSkip={step === TOTAL_STEPS ? undefined : goSkip}
      ctaLabel={STEP_CTA[step - 1] ?? STEP_CTA[0]}
      ctaDisabled={step === TOTAL_STEPS && !consented}
      ctaTestID="onboarding-cta"
      footerNote={
        step === TOTAL_STEPS
          ? "No money is held until you confirm a commitment."
          : undefined
      }
      onCta={() => {
        if (step === TOTAL_STEPS) {
          void finish("complete");
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
