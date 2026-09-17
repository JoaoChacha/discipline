import type { ConfigContext, ExpoConfig } from "expo/config";

const appEnv = process.env.APP_ENV ?? "development";
const isPreprod = appEnv === "preprod";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: isPreprod ? "Discipline Preprod" : "Discipline",
  slug: "discipline",
  scheme: isPreprod ? "discipline-preprod" : "discipline",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon-light.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: isPreprod
      ? "com.discipline.app.preprod"
      : "com.discipline.app",
    supportsTablet: true,
    icon: {
      light: "./assets/icon-light.png",
      dark: "./assets/icon-dark.png",
    },
  },
  android: {
    package: isPreprod ? "com.discipline.app.preprod" : "com.discipline.app",
    adaptiveIcon: {
      foregroundImage: "./assets/icon-light.png",
      backgroundColor: "#0D0D0F",
    },
  },
  extra: {
    eas: {
      projectId: "21e04c5e-7eeb-4eb4-872f-33ec00f5aaaa",
    },
    appEnv,
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    reactCompiler: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    "expo-font",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F7F6FA",
        image: "./assets/icon-light.png",
        dark: {
          backgroundColor: "#0D0D0F",
          image: "./assets/icon-dark.png",
        },
      },
    ],
  ],
});
