import { Platform } from "react-native";
import Constants from "expo-constants";

import { isPreprod } from "./app-env";

const PREPROD_API_URL =
  "https://discipline-git-preprod-joo-chchs-projects.vercel.app";
const PROD_API_URL = "https://discipline.vercel.app";

/**
 * Resolve the tRPC / Better Auth host.
 *
 * Hosted builds set `EXPO_PUBLIC_API_URL` in the EAS profile.
 * On a Cloud Agent the phone is not on the same network as the VM, so
 * `EXPO_PUBLIC_API_URL` must be a public tunnel (see `pnpm dev:phone`).
 * On your own LAN, Expo's host URI is reused and port 3000 is assumed.
 */
export const getBaseUrl = () => {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  if (explicit) {
    return explicit;
  }

  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    return `http://${localhost}:3000`;
  }

  return isPreprod ? PREPROD_API_URL : PROD_API_URL;
};
