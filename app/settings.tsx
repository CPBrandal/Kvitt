import { commonStyles } from "@/constants/styles";
import { useLanguage } from "@/context/LanguageContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslate } from "@/hooks/useTranslate";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { language, setLanguage } = useLanguage();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const translate = useTranslate();
  return (
    <>
      <Stack.Screen
        options={{
          title: translate("Settings"),
          headerShown: true,
          headerStyle: {
            backgroundColor: isDark ? "#1f2937" : "#f9fafb",
          },
          headerTintColor: isDark ? "#f9fafb" : "#1f2937",
          headerLeft: () => (
            <View className="h-full items-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-2" // Add touchable area
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={isDark ? "#f9fafb" : "#1f2937"}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-950">
        <View
          className={`${commonStyles.bg} ${commonStyles.border} rounded-2xl p-8 border-2 items-center mb-8 flex-row items-center justify-between gap-2`}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={24}
            color={
              isDark
                ? `${commonStyles.imgColorDark}`
                : `${commonStyles.imgColorLight}`
            }
          />
          <Switch
            value={isDark}
            onValueChange={toggleColorScheme}
            trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
            thumbColor={isDark ? "#1e40af" : "#f3f4f6"}
          />
        </View>
        <View
          className={`${commonStyles.bg} ${commonStyles.border} rounded-2xl p-8 border-2 items-center mb-8 flex-row items-center justify-between gap-2`}
        >
          <View className={`${commonStyles.bg} ${commonStyles.border} p-4 `}>
            <Text
              className={`${commonStyles.text} text-lg font-semibold mb-3 text-center`}
            >
              {translate("Language")}
            </Text>

            <TouchableOpacity
              onPress={() => setLanguage("nb")}
              className={`p-3 rounded-lg mb-2 ${
                language === "nb"
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Text
                className={
                  language === "nb"
                    ? "text-black dark:text-white font-semibold"
                    : "text-black dark:text-white"
                }
              >
                🇳🇴 Norsk
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setLanguage("en")}
              className={`p-3 rounded-lg ${
                language === "en"
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Text
                className={
                  language === "en"
                    ? "text-black dark:text-white font-semibold"
                    : "text-black dark:text-white"
                }
              >
                🇬🇧 English
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
