import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { commonStyles } from "@/constants/styles";
import { useTranslate } from "@/hooks/useTranslate";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";

export default function TabLayout() {
  const translate = useTranslate();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? "#ffffff" : "#000000",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: isDark ? "#111827" : "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: translate("Home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="receipts"
        options={{
          title: translate("MyReceits"),
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="document.fill"
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: translate("MyProfile"),
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="person.fill"
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
