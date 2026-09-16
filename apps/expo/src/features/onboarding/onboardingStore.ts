import type { OnboardingState } from "./storage";
import { loadOnboardingState } from "./storage";

const listeners = new Set<() => void>();

let snapshot: OnboardingState = { status: "pending" };
let loadPromise: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function ensureOnboardingLoaded() {
  loadPromise ??= loadOnboardingState().then((state) => {
    snapshot = state;
    emit();
  });
  return loadPromise;
}

void ensureOnboardingLoaded();

export function subscribeOnboarding(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getOnboardingSnapshot() {
  return snapshot;
}

export function publishOnboardingState(state: OnboardingState) {
  snapshot = state;
  emit();
}
