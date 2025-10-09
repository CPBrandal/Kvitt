// hooks/use-color-scheme.ts
import { useColorScheme as useRNColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const THEME_KEY = "@app_theme";

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorSchemeState] = useState<"light" | "dark">(
    systemColorScheme ?? "light"
  );

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        setColorSchemeState(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setColorScheme = async (theme: "light" | "dark") => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
      setColorSchemeState(theme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleColorScheme = () => {
    const newTheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(newTheme);
  };

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
  };
}
