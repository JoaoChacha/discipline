import { Platform } from "react-native";
import Constants from "expo-constants";

/**
 * Resolve the tRPC / Better Auth host.
 *
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

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // return "https://your-production-api.example.com";
    throw new Error(
      "Failed to get localhost. Set EXPO_PUBLIC_API_URL or point to your production server.",
    );
  }
  return `http://${localhost}:3000`;
};
