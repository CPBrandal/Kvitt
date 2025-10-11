import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "nb";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loading: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "nb",
  setLanguage: async () => {},
  loading: true,
});

const LANGUAGE_STORAGE_KEY = "@app_language";

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>("nb");
  const [loading, setLoading] = useState(true);

  // Load language from AsyncStorage on app start
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === "en" || savedLanguage === "nb") {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error("Error loading language:", error);
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
