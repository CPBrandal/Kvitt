import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

export default function ReceiptScanner() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 justify-center px-6 bg-gray-50 dark:bg-gray-950">
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 items-center mb-8">
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={64}
          color={isDark ? "#3b82f6" : "#f59e0b"}
        />
        <Text className="text-gray-900 dark:text-gray-50 text-2xl font-bold mt-4">
          {isDark ? "Dark Mode" : "Light Mode"}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Theme follows device settings
        </Text>
      </View>
    </View>
  );
}
