export default {
  expo: {
    name: "Kvitt",
    slug: "kvitt", // CHANGED: lowercase to match EAS project
    owner: "cpbrandal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "kvitt",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cpbrandal.kvitt",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription:
          "This app needs camera access to scan receipts.",
        NSPhotoLibraryUsageDescription:
          "This app needs access to your photos to scan receipts.",
        ITSAppUsesNonExemptEncryption: false, // ADD THIS LINE
      },
    },
    android: {
      package: "com.cpbrandal.kvitt", // ADD THIS
      googleServicesFile: "./google-services.json", // ADD THIS
      adaptiveIcon: {
        backgroundColor: "#3D5A5E",
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundImage: "./assets/images/android-icon-background.png",
      },
      adaptiveIcon: {},
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
      ],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-sqlite",
      "expo-web-browser", // ADD THIS LINE
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "bd09c2d7-8b20-4fdd-b297-caf28a5971b7",
      },
      // Google Sign-In Client IDs - ADD THIS SECTION
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      googleExpoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    },
  },
};
