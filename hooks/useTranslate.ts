import { getTranslation, TranslationKey } from "@/constants/textMappings";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Hook to translate text based on current language
 * Usage: const t = useTranslate();
 *        <Text>{t("WelcomeBack")}</Text>
 */
export const useTranslate = () => {
  const { language } = useLanguage();

  return (key: TranslationKey): string => {
    return getTranslation(key, language);
  };
};
