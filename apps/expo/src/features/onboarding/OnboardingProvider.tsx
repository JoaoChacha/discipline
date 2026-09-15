import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

import type { CharityAllocation } from "./charities";
import {
  addCharity,
  DEFAULT_ALLOCATIONS,
  removeCharity,
  setAllocationPercent,
} from "./charities";
import {
  loadOnboardingState,
  resetOnboardingState,
  saveOnboardingState,
} from "./storage";
import { publishOnboardingState } from "./useOnboardingGate";

interface OnboardingContextValue {
  step: number;
  allocations: CharityAllocation[];
  consented: boolean;
  goTo: (step: number) => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  setConsented: (value: boolean) => void;
  updatePercent: (charityId: string, percent: number) => void;
  selectCharity: (charityId: string) => void;
  unselectCharity: (charityId: string) => void;
  complete: () => Promise<void>;
  dismiss: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const LAST_STEP = 5;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [allocations, setAllocations] =
    useState<CharityAllocation[]>(DEFAULT_ALLOCATIONS);
  const [consented, setConsented] = useState(false);

  const goTo = useCallback((nextStep: number) => {
    setStep(Math.max(1, Math.min(LAST_STEP, nextStep)));
  }, []);

  const next = useCallback(() => {
    setStep((current) => Math.min(LAST_STEP, current + 1));
  }, []);

  const back = useCallback(() => {
    setStep((current) => Math.max(1, current - 1));
  }, []);

  const skip = useCallback(() => {
    setStep(LAST_STEP);
  }, []);

  const updatePercent = useCallback((charityId: string, percent: number) => {
    setAllocations((current) =>
      setAllocationPercent(current, charityId, percent),
    );
  }, []);

  const selectCharity = useCallback((charityId: string) => {
    setAllocations((current) => addCharity(current, charityId));
  }, []);

  const unselectCharity = useCallback((charityId: string) => {
    setAllocations((current) => removeCharity(current, charityId));
  }, []);

  const complete = useCallback(async () => {
    const next = {
      status: "completed" as const,
      allocations,
    };
    await saveOnboardingState(next);
    publishOnboardingState(next);
  }, [allocations]);

  const dismiss = useCallback(async () => {
    const next = {
      status: "dismissed" as const,
      allocations,
    };
    await saveOnboardingState(next);
    publishOnboardingState(next);
  }, [allocations]);

  const value = useMemo(
    () => ({
      step,
      allocations,
      consented,
      goTo,
      next,
      back,
      skip,
      setConsented,
      updatePercent,
      selectCharity,
      unselectCharity,
      complete,
      dismiss,
    }),
    [
      allocations,
      back,
      complete,
      consented,
      dismiss,
      goTo,
      next,
      selectCharity,
      skip,
      step,
      unselectCharity,
      updatePercent,
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
