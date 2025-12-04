// constants/styles.ts
import { CUSTOM_PALETTE } from "./colors";

// Text colors using custom palette
export const textColors = {
  primary: "text-gray-900 dark:text-gray-50", // Main text - keeping standard for readability
  secondary: "text-gray-600 dark:text-gray-400", // Secondary text
  muted: "text-gray-500 dark:text-gray-500", // Muted text
  accent: CUSTOM_PALETTE.rgb.tarawera, // For labels and secondary info
  accentDark: CUSTOM_PALETTE.rgb.porcelain, // For dark mode text
};

// Background colors using custom palette
export const bgColors = {
  primary: "bg-gray-50 dark:bg-gray-950", // Screen background
  porcelain: CUSTOM_PALETTE.rgb.porcelain, // Light background
  swamp: CUSTOM_PALETTE.rgb.swamp, // Dark background
  daintree: CUSTOM_PALETTE.rgb.daintree, // Dark card background
  daintreeLight: CUSTOM_PALETTE.rgb.daintreeLight, // Dark secondary background
  cream: CUSTOM_PALETTE.rgb.cream, // Soft cream/beige background
};

export const commonStyles = {
  // Text styles - keeping standard grays for main text for readability
  text: "text-gray-900 dark:text-gray-50",
  textMuted: "text-gray-600 dark:text-gray-400",
  // Background styles
  bg: "bg-white dark:bg-gray-900",
  bgScreen: "bg-gray-50 dark:bg-gray-950",
  border: "border-gray-300 dark:border-gray-700",
  // Custom palette colors for icons and accents
  imgColorDark: CUSTOM_PALETTE.rgb.smaltBlue, // Icon color for dark mode
  imgColorLight: CUSTOM_PALETTE.rgb.deepSeaGreen, // Icon color for light mode
  color: CUSTOM_PALETTE.rgb.smaltBlue, // Primary accent color
  // Additional custom palette colors
  primary: CUSTOM_PALETTE.rgb.deepSeaGreen, // Primary action color
  secondary: CUSTOM_PALETTE.rgb.smaltBlue, // Secondary accent color
  accent: CUSTOM_PALETTE.rgb.tarawera, // Accent text color
  backgroundLight: CUSTOM_PALETTE.rgb.porcelain, // Light background
  backgroundDark: CUSTOM_PALETTE.rgb.swamp, // Dark background
};
