import { Platform } from "react-native";

const IOS_SYSTEM_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(248, 248, 249)",
    grey5: "rgb(237, 238, 239)",
    grey4: "rgb(226, 228, 229)",
    grey3: "rgb(210, 212, 215)",
    grey2: "rgb(178, 182, 186)",
    grey: "rgb(157, 161, 166)",
    background: "rgb(245, 247, 249)",
    foreground: "rgb(3, 4, 5)",
    root: "rgb(245, 247, 249)",
    card: "rgb(245, 247, 249)",
    destructive: "rgb(255, 56, 43)",
    primary: "rgb(0, 123, 255)",
  },
  dark: {
    grey6: "rgb(26, 27, 28)",
    grey5: "rgb(43, 45, 47)",
    grey4: "rgb(55, 58, 61)",
    grey3: "rgb(74, 78, 82)",
    grey2: "rgb(115, 121, 128)",
    grey: "rgb(155, 160, 165)",
    background: "rgb(0, 2, 4)",
    foreground: "rgb(247, 251, 255)",
    root: "rgb(0, 2, 4)",
    card: "rgb(0, 2, 4)",
    destructive: "rgb(254, 67, 54)",
    primary: "rgb(0, 123, 255)",
  },
} as const;

const ANDROID_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(248, 248, 248)",
    grey5: "rgb(237, 238, 239)",
    grey4: "rgb(226, 227, 229)",
    grey3: "rgb(210, 212, 214)",
    grey2: "rgb(178, 181, 185)",
    grey: "rgb(156, 161, 166)",
    background: "rgb(245, 247, 248)",
    foreground: "rgb(4, 5, 6)",
    root: "rgb(245, 247, 248)",
    card: "rgb(245, 247, 248)",
    destructive: "rgb(186, 26, 26)",
    primary: "rgb(0, 111, 231)",
  },
  dark: {
    grey6: "rgb(26, 27, 29)",
    grey5: "rgb(44, 46, 48)",
    grey4: "rgb(56, 59, 62)",
    grey3: "rgb(75, 79, 83)",
    grey2: "rgb(116, 122, 128)",
    grey: "rgb(156, 160, 165)",
    background: "rgb(0, 2, 5)",
    foreground: "rgb(246, 250, 255)",
    root: "rgb(0, 2, 5)",
    card: "rgb(0, 2, 5)",
    destructive: "rgb(147, 0, 10)",
    primary: "rgb(43, 145, 255)",
  },
} as const;

const WEB_COLORS = {
  white: "rgb(255, 255, 255)",
  black: "rgb(0, 0, 0)",
  light: {
    grey6: "rgb(247, 248, 248)",
    grey5: "rgb(237, 238, 239)",
    grey4: "rgb(226, 227, 229)",
    grey3: "rgb(210, 212, 214)",
    grey2: "rgb(178, 181, 185)",
    grey: "rgb(156, 161, 166)",
    background: "rgb(245, 246, 248)",
    foreground: "rgb(4, 5, 6)",
    root: "rgb(245, 246, 248)",
    card: "rgb(245, 246, 248)",
    destructive: "rgb(186, 26, 26)",
    primary: "rgb(0, 110, 227)",
  },
  dark: {
    grey6: "rgb(26, 27, 29)",
    grey5: "rgb(44, 46, 48)",
    grey4: "rgb(56, 59, 62)",
    grey3: "rgb(75, 79, 83)",
    grey2: "rgb(116, 122, 128)",
    grey: "rgb(156, 160, 165)",
    background: "rgb(0, 2, 5)",
    foreground: "rgb(246, 250, 255)",
    root: "rgb(0, 2, 5)",
    card: "rgb(0, 2, 5)",
    destructive: "rgb(147, 0, 10)",
    primary: "rgb(40, 144, 255)",
  },
} as const;

export const COLORS =
  Platform.OS === "ios"
    ? IOS_SYSTEM_COLORS
    : Platform.OS === "android"
    ? ANDROID_COLORS
    : WEB_COLORS;
