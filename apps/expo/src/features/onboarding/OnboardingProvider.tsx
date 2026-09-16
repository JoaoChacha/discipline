import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { completeAuthenticatedOnboarding } from "~/features/auth/completeEntry";
import { publishOnboardingState } from "./onboardingStore";
import {
  loadOnboardingState,
  resetOnboardingState,
  saveOnboardingState,
  savePendingConsent,
} from "./storage";

export const WELCOME_STEP = 0;
export const FIRST_STEP = 1;
export const LAST_STEP = 5;

interface OnboardingContextValue {
  step: number;
  consented: boolean;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  replay: () => void;
  setConsented: (value: boolean) => void;
  stashConsent: () => Promise<void>;
  complete: () => Promise<void>;
  dismiss: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(WELCOME_STEP);
  const [consented, setConsented] = useState(false);

  const goTo = useCallback((nextStep: number) => {
    setStep(Math.max(WELCOME_STEP, Math.min(LAST_STEP, nextStep)));
  }, []);

  const next = useCallback(() => {
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }, []);

  const back = useCallback(() => {
    setStep((current) => Math.max(WELCOME_STEP, current - 1));
  }, []);

  const skip = useCallback(() => {
    setStep(LAST_STEP);
  }, []);

  const replay = useCallback(() => {
    setConsented(false);
    setStep(WELCOME_STEP);
  }, []);

  const stashConsent = useCallback(async () => {
    await savePendingConsent(CURRENT_TERMS_VERSION);
    const nextState = await loadOnboardingState();
    publishOnboardingState(nextState);
  }, []);

  const complete = useCallback(async () => {
    await stashConsent();
    await completeAuthenticatedOnboarding();
  }, [stashConsent]);

  const dismiss = useCallback(async () => {
    const nextState = { status: "pending" as const };
    await saveOnboardingState(nextState);
    publishOnboardingState(nextState);
  }, []);

  const value = useMemo(
    () => ({
      step,
      consented,
      goTo,
      next,
      back,
      skip,
      replay,
      setConsented,
      stashConsent,
      complete,
      dismiss,
    }),
    [
      back,
      complete,
      consented,
      dismiss,
      goTo,
      next,
      replay,
      skip,
      stashConsent,
      step,
    ],
  );

  return <OnboardingContext value={value}>{children}</OnboardingContext>;
}

export function useOnboarding() {
  const context = use(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}

export { loadOnboardingState, resetOnboardingState };
