import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const GOOGLE_CLOUD_API_KEY = Constants.expoConfig?.extra?.googleCloudApiKey;

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri);
        // Do something with the image
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleChooseFromGallery = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need photo library permissions!");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri);
        // Do something with the image
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header with Theme Toggle */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Kvitt
          </Text>

          {/* Theme Toggle */}
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={24}
              color={isDark ? "#fbbf24" : "#f59e0b"}
            />
            <Switch
              value={isDark}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
              thumbColor={isDark ? "#1e40af" : "#f3f4f6"}
            />
          </View>
        </View>
      </View>

      {/* Main Content - Centered */}
      <View className="flex-1 justify-center px-6">
        {/* Theme Indicator */}
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

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleTakePhoto}
          className="bg-blue-600 dark:bg-blue-500 rounded-2xl p-5 mb-3 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text className="text-white text-lg font-semibold ml-3">
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleChooseFromGallery}
          className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons
            name="images"
            size={24}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
          <Text className="text-gray-900 dark:text-gray-50 text-lg font-semibold ml-3">
            Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
