import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "discipline.onboarding.v2";

export type OnboardingStatus = "pending" | "completed" | "dismissed";

export interface OnboardingState {
  status: OnboardingStatus;
}

const DEFAULT_STATE: OnboardingState = {
  status: "pending",
};

function canUseSecureStore() {
  return Platform.OS !== "web";
}

async function readRaw(): Promise<string | null> {
  if (canUseSecureStore()) {
    return SecureStore.getItemAsync(STORAGE_KEY);
  }
  if (typeof localStorage === "undefined") {
    return null;
  }
  return localStorage.getItem(STORAGE_KEY);
}

async function writeRaw(value: string | null) {
  if (canUseSecureStore()) {
    if (value === null) {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEY, value);
    return;
  }
  if (typeof localStorage === "undefined") {
    return;
  }
  if (value === null) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, value);
}

export async function loadOnboardingState(): Promise<OnboardingState> {
  const raw = await readRaw();
  if (!raw) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return {
      status:
        parsed.status === "completed" || parsed.status === "dismissed"
          ? parsed.status
          : "pending",
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export async function saveOnboardingState(state: OnboardingState) {
  await writeRaw(JSON.stringify(state));
}

export async function resetOnboardingState() {
  await writeRaw(null);
}
