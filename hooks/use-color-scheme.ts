import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

const THEME_KEY = "@app_theme";

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const { setColorScheme: setNativeWindColorScheme } =
    useNativeWindColorScheme();

  const [colorScheme, setColorSchemeState] = useState<"light" | "dark">(
    systemColorScheme ?? "light"
  );

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    const checkSavedTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (!savedTheme && systemColorScheme) {
        setColorSchemeState(systemColorScheme);
        setNativeWindColorScheme(systemColorScheme);
      }
    };
    checkSavedTheme();
  }, [systemColorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        setColorSchemeState(savedTheme);
        setNativeWindColorScheme(savedTheme);
      } else if (systemColorScheme) {
        setColorSchemeState(systemColorScheme);
        setNativeWindColorScheme(systemColorScheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setColorScheme = async (theme: "light" | "dark") => {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
      setColorSchemeState(theme);
      setNativeWindColorScheme(theme);
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
