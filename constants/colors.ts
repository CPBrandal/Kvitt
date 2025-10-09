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
