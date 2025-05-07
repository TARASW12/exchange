import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "exchange",
  slug: "exchange",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    COIN_LAYER_ACCESS_KEY: process.env.EXPO_PUBLIC_COINLAYER_ACCESS_KEY,
    API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    API_TIMEOUT: process.env.EXPO_PUBLIC_API_TIMEOUT,
  }
}); 