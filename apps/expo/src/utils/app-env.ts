import Constants from "expo-constants";

export type AppEnv = "development" | "preprod" | "production";

const extra = Constants.expoConfig?.extra as { appEnv?: string } | undefined;
const raw = extra?.appEnv;

export const appEnv: AppEnv =
  raw === "preprod" || raw === "production" ? raw : "development";

export const isPreprod = appEnv === "preprod";

export const appScheme = isPreprod ? "discipline-preprod" : "discipline";
