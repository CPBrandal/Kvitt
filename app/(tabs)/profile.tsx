import { commonStyles } from "@/constants/styles";
import { translate } from "@/constants/textMappings";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, loading } = useAuth();

  return (
    <>
      <Stack.Screen
        options={{
          title: translate("Profile"),
          headerShown: true,
          headerStyle: {
            backgroundColor: isDark ? "#1f2937" : "#f9fafb",
          },
          headerTintColor: isDark ? "#f9fafb" : "#1f2937",
          headerRight: () => (
            <View className="">
              <TouchableOpacity
                onPress={() => {
                  router.push("/settings");
                }}
                className={` p-3 rounded-lg`}
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={
                    isDark
                      ? commonStyles.imgColorDark
                      : commonStyles.imgColorLight
                  }
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View className={`flex-1 justify-center px-6 ${commonStyles.bgScreen}`}>
        <View
          className={`${commonStyles.bgScreen} rounded-2xl p-8 border-2 ${commonStyles.border} items-center mb-8`}
        >
          <Ionicons
            name={"person"}
            size={64}
            color={
              isDark
                ? `${commonStyles.imgColorDark}`
                : `${commonStyles.imgColorLight}`
            }
          />
          <Text className={`${commonStyles.text} text-2xl font-bold mt-4`}>
            {user?.displayName || translate("Profile")}
          </Text>
          <Text className={`${commonStyles.textMuted}text-center mt-2`}>
            {user?.email || translate("Email")}
          </Text>
        </View>
        <View
          className={`${commonStyles.bg} ${commonStyles.border} rounded-2xl p-8 border-2 items-center mb-8`}
        ></View>
        <Text className={`${commonStyles.text} text-2xl font-bold mt-4`}>
          {"Past Receipts"}
        </Text>
        <View
          className={`${commonStyles.bg} ${commonStyles.border} rounded-2xl p-8 border-2 items-center mb-8`}
        ></View>
        <View
          className={`${commonStyles.bg} ${commonStyles.border} rounded-2xl p-8 border-2 items-center mb-8`}
        ></View>
      </View>
    </>
  );
}
