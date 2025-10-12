import { commonStyles } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslate } from "@/hooks/useTranslate";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { language, setLanguage } = useLanguage();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { user } = useAuth();
  const isDark = colorScheme === "dark";
  const translate = useTranslate();
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: translate("Settings"),
      headerShown: true,
      headerStyle: {
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
      },
      headerTintColor: isDark ? "#f9fafb" : "#1f2937",
      headerLeft: () => (
        <View className="h-full items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#f9fafb" : "#1f2937"}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, translate, isDark]);

  const handleLanguageChange = async (lang: "en" | "nb") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLanguage(lang);
  };

  const handleToggleDarkMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleColorScheme();
  };

  const SettingSection = ({ title }: { title: string }) => (
    <Text className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide px-6 mt-6 mb-2">
      {title}
    </Text>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightComponent,
    showChevron = false,
    danger = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`${commonStyles.bg} border-b ${commonStyles.border} px-6 py-4 flex-row items-center`}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={danger ? "#ef4444" : isDark ? "#3b82f6" : "#2563eb"}
        style={{ marginRight: 12 }}
      />
      <View className="flex-1">
        <Text
          className={`${
            danger ? "text-red-500" : commonStyles.text
          } text-base font-medium`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className={`flex-1 ${commonStyles.bgScreen}`}
      showsVerticalScrollIndicator={false}
    >
      {/* User Info */}
      <View className="px-6 pt-6 pb-4">
        <View
          className={`${commonStyles.bg} rounded-2xl p-6 border ${commonStyles.border} flex-row items-center`}
        >
          <View
            className={`w-16 h-16 rounded-full ${
              isDark ? "bg-blue-900" : "bg-blue-100"
            } items-center justify-center`}
          >
            <Text className="text-3xl">
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className={`${commonStyles.text} text-lg font-semibold`}>
              {user?.displayName || "User"}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {user?.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Appearance */}
      <SettingSection title={translate("Apperance")} />
      <View className={`${commonStyles.bg} mx-6 rounded-xl overflow-hidden`}>
        <SettingItem
          icon={isDark ? "moon" : "sunny"}
          title={translate("DarkMode") || "Dark Mode"}
          subtitle={
            isDark
              ? translate("DarkModeOn") || "Dark mode is on"
              : translate("DarkModeOff") || "Dark mode is off"
          }
          rightComponent={
            <Switch
              value={isDark}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
              thumbColor={isDark ? "#1e40af" : "#f3f4f6"}
            />
          }
        />
      </View>

      {/* Language */}
      <SettingSection title={translate("Language") || "LANGUAGE"} />
      <View className={`${commonStyles.bg} mx-6 rounded-xl overflow-hidden`}>
        <TouchableOpacity
          onPress={() => handleLanguageChange("nb")}
          className={`px-6 py-4 flex-row items-center justify-between border-b ${commonStyles.border}`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🇳🇴</Text>
            <Text className={`${commonStyles.text} text-base`}>Norsk</Text>
          </View>
          {language === "nb" && (
            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLanguageChange("en")}
          className="px-6 py-4 flex-row items-center justify-between"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🇬🇧</Text>
            <Text className={`${commonStyles.text} text-base`}>English</Text>
          </View>
          {language === "en" && (
            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
          )}
        </TouchableOpacity>
      </View>

      {/* Receipts */}
      <SettingSection title={translate("Receipts") || "RECEIPTS"} />
      <View className={`${commonStyles.bg} mx-6 rounded-xl overflow-hidden`}>
        <SettingItem
          icon="cloud-upload-outline"
          title={translate("BackupData")}
          subtitle={translate("BackupSubtitle") || "Export your receipts"}
          onPress={() => Alert.alert("Info", "Backup feature coming soon")}
          showChevron
        />
        <SettingItem
          icon="trash-outline"
          title={translate("ClearCache") || "Clear Cache"}
          subtitle={translate("ClearCacheSubtitle") || "Free up storage space"}
          onPress={() =>
            Alert.alert(
              translate("ClearCache") || "Clear Cache",
              translate("ClearCacheConfirm") ||
                "This will clear temporary files",
              [
                { text: translate("Cancel") || "Cancel", style: "cancel" },
                {
                  text: translate("Clear") || "Clear",
                  onPress: () => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    Alert.alert("Success", "Cache cleared");
                  },
                },
              ]
            )
          }
          showChevron
        />
      </View>

      {/* Notifications */}
      <SettingSection title={translate("Notifications") || "NOTIFICATIONS"} />
      <View className={`${commonStyles.bg} mx-6 rounded-xl overflow-hidden`}>
        <SettingItem
          icon="notifications-outline"
          title={translate("PushNotifications") || "Push Notifications"}
          subtitle={
            notificationsEnabled
              ? translate("NotificationsOn") || "You'll receive notifications"
              : translate("NotificationsOff") || "Notifications are off"
          }
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setNotificationsEnabled(value);
              }}
              trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
              thumbColor={notificationsEnabled ? "#1e40af" : "#f3f4f6"}
            />
          }
        />
      </View>

      {/* About */}
      <SettingSection title={translate("About") || "ABOUT"} />
      <View className={`${commonStyles.bg} mx-6 rounded-xl overflow-hidden`}>
        <SettingItem
          icon="information-circle-outline"
          title={translate("Version") || "Version"}
          subtitle={Constants.expoConfig?.version || "1.0.0"}
        />
        <SettingItem
          icon="help-circle-outline"
          title={translate("Help") || "Help & Support"}
          onPress={() =>
            Alert.alert("Info", "Help & support feature coming soon")
          }
          showChevron
        />
        <SettingItem
          icon="document-text-outline"
          title={translate("PrivacyPolicy") || "Privacy Policy"}
          onPress={() =>
            Alert.alert("Info", "Privacy policy feature coming soon")
          }
          showChevron
        />
        <SettingItem
          icon="document-text-outline"
          title={translate("TermsOfService") || "Terms of Service"}
          onPress={() =>
            Alert.alert("Info", "Terms of service feature coming soon")
          }
          showChevron
        />
      </View>

      {/* Footer Spacing */}
      <View className="h-8" />
    </ScrollView>
  );
}
