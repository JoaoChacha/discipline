import { useCallback, useSyncExternalStore } from "react";

import type { OnboardingState } from "./storage";
import { loadOnboardingState, resetOnboardingState } from "./storage";

const listeners = new Set<() => void>();

let snapshot: OnboardingState | null = null;
let loadPromise: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function ensureLoaded() {
  loadPromise ??= loadOnboardingState().then((state) => {
    snapshot = state;
    emit();
  });
  return loadPromise;
}

void ensureLoaded();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

export function publishOnboardingState(state: OnboardingState) {
  snapshot = state;
  emit();
}

export function useOnboardingGate() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const refresh = useCallback(async () => {
    snapshot = await loadOnboardingState();
    emit();
  }, []);

  const replay = useCallback(async () => {
    await resetOnboardingState();
    snapshot = { status: "pending" };
    emit();
  }, []);

  return {
    ready: state !== null,
    needsOnboarding: state?.status === "pending",
    replay,
    refresh,
  };
}
