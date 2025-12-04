// constants/colors.ts
import { Platform } from "react-native";

const IOS_SYSTEM_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    background: "rgb(245, 247, 249)",
    foreground: "rgb(3, 4, 5)",
    card: "rgb(255, 255, 255)",
    cardForeground: "rgb(0, 7, 14)",
    border: "rgb(232, 237, 243)",
    muted: "rgb(210, 216, 222)",
    mutedForeground: "rgb(65, 76, 88)",
    primary: "rgb(0, 123, 255)",
    primaryForeground: "rgb(240, 247, 255)",
    destructive: "rgb(255, 56, 43)",
    destructiveForeground: "rgb(255, 255, 255)",
    // Add more semantic color names as needed
    buttonBackground: "rgb(0, 123, 255)",
    buttonForeground: "rgb(255, 255, 255)",
    secondaryButton: "rgb(255, 255, 255)",
    secondaryButtonForeground: "rgb(3, 4, 5)",
  },
  dark: {
    background: "rgb(0, 2, 4)",
    foreground: "rgb(247, 251, 255)",
    card: "rgb(18, 30, 42)",
    cardForeground: "rgb(247, 251, 255)",
    border: "rgb(56, 63, 71)",
    muted: "rgb(210, 216, 222)",
    mutedForeground: "rgb(65, 76, 88)",
    primary: "rgb(0, 123, 255)",
    primaryForeground: "rgb(255, 255, 255)",
    destructive: "rgb(254, 67, 54)",
    destructiveForeground: "rgb(255, 255, 255)",
    // Add more semantic color names as needed
    buttonBackground: "rgb(0, 123, 255)",
    buttonForeground: "rgb(255, 255, 255)",
    secondaryButton: "rgb(18, 30, 42)",
    secondaryButtonForeground: "rgb(247, 251, 255)",
  },
} as const;

const ANDROID_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    background: "rgb(245, 247, 248)",
    foreground: "rgb(4, 5, 6)",
    card: "rgb(255, 255, 255)",
    cardForeground: "rgb(4, 5, 6)",
    border: "rgb(232, 237, 243)",
    muted: "rgb(210, 216, 222)",
    mutedForeground: "rgb(65, 76, 88)",
    primary: "rgb(0, 111, 231)",
    primaryForeground: "rgb(255, 255, 255)",
    destructive: "rgb(186, 26, 26)",
    destructiveForeground: "rgb(255, 255, 255)",
    buttonBackground: "rgb(0, 111, 231)",
    buttonForeground: "rgb(255, 255, 255)",
    secondaryButton: "rgb(255, 255, 255)",
    secondaryButtonForeground: "rgb(4, 5, 6)",
  },
  dark: {
    background: "rgb(0, 2, 5)",
    foreground: "rgb(246, 250, 255)",
    card: "rgb(18, 30, 42)",
    cardForeground: "rgb(246, 250, 255)",
    border: "rgb(56, 63, 71)",
    muted: "rgb(210, 216, 222)",
    mutedForeground: "rgb(65, 76, 88)",
    primary: "rgb(43, 145, 255)",
    primaryForeground: "rgb(255, 255, 255)",
    destructive: "rgb(147, 0, 10)",
    destructiveForeground: "rgb(255, 255, 255)",
    buttonBackground: "rgb(43, 145, 255)",
    buttonForeground: "rgb(255, 255, 255)",
    secondaryButton: "rgb(18, 30, 42)",
    secondaryButtonForeground: "rgb(246, 250, 255)",
  },
} as const;

const WEB_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    background: "rgb(245, 246, 248)",
    foreground: "rgb(4, 5, 6)",
    card: "rgb(255, 255, 255)",
    cardForeground: "rgb(4, 5, 6)",
    border: "rgb(232, 237, 243)",
    muted: "rgb(210, 216, 222)",
    mutedForeground: "rgb(65, 76, 88)",
    primary: "rgb(0, 110, 227)",
    primaryForeground: "rgb(255, 255, 255)",
    destructive: "rgb(186, 26, 26)",
    destructiveForeground: "rgb(255, 255, 255)",
    buttonBackground: "rgb(0, 110, 227)",
    buttonForeground: "rgb(255, 255, 255)",
    secondaryButton: "rgb(255, 255, 255)",
    secondaryButtonForeground: "rgb(4, 5, 6)",
  },
  dark: {
    background: "rgb(0, 2, 5)",
    foreground: "rgb(246, 250, 255)",
    card: "rgb(18, 30, 42)",
    cardForeground: "rgb(246, 250, 255)",
    border: "rgb(56, 63, 71)",
    muted: "rgb(210, 216, 222)",
    mutedForeground: "rgb(65, 76, 88)",
    primary: "rgb(40, 144, 255)",
    primaryForeground: "rgb(255, 255, 255)",
    destructive: "rgb(147, 0, 10)",
    destructiveForeground: "rgb(255, 255, 255)",
    buttonBackground: "rgb(40, 144, 255)",
    buttonForeground: "rgb(255, 255, 255)",
    secondaryButton: "rgb(18, 30, 42)",
    secondaryButtonForeground: "rgb(246, 250, 255)",
  },
} as const;

export const PLATFORM_COLORS =
  Platform.OS === "ios"
    ? IOS_SYSTEM_COLORS
    : Platform.OS === "android"
    ? ANDROID_COLORS
    : WEB_COLORS;

// Custom Color Palette - Teal/Blue Theme
export const CUSTOM_PALETTE = {
  // Hex values for reference
  hex: {
    smaltBlue: "#567e89",
    swamp: "#001119",
    tarawera: "#083f4d",
    porcelain: "#f1f4f5",
    deepSeaGreen: "#0b4953",
    daintree: "#011b28",
    daintreeLight: "#022c38",
    cream: "#f5f3f0", // Soft cream/beige background
  },
  // RGB values for React Native
  rgb: {
    smaltBlue: "rgb(86, 126, 137)",
    swamp: "rgb(0, 17, 25)",
    tarawera: "rgb(8, 63, 77)",
    porcelain: "rgb(241, 244, 245)",
    deepSeaGreen: "rgb(11, 73, 83)",
    daintree: "rgb(1, 27, 40)",
    daintreeLight: "rgb(2, 44, 56)",
    cream: "rgb(245, 243, 240)",
  },
  // RGBA values for transparency support
  rgba: {
    smaltBlue: "rgba(86, 126, 137, 1)",
    swamp: "rgba(0, 17, 25, 1)",
    tarawera: "rgba(8, 63, 77, 1)",
    porcelain: "rgba(241, 244, 245, 1)",
    deepSeaGreen: "rgba(11, 73, 83, 1)",
    daintree: "rgba(1, 27, 40, 1)",
    daintreeLight: "rgba(2, 44, 56, 1)",
    cream: "rgba(245, 243, 240, 1)",
  },
} as const;
