import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleTakePhoto = () => {
    console.log("Opening camera...");
    // TODO: Implement camera functionality
  };

  const handleChooseFromGallery = () => {
    console.log("Opening gallery...");
    // TODO: Implement gallery picker
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header with Theme Toggle */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-foreground">Kvitt</Text>

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
        <View className="bg-card rounded-2xl p-8 border-2 border-border items-center mb-8">
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={64}
            color={isDark ? "#3b82f6" : "#f59e0b"}
          />
          <Text className="text-foreground text-2xl font-bold mt-4">
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>
          <Text className="text-muted-foreground text-center mt-2">
            Theme follows device settings
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleTakePhoto}
          className="bg-primary rounded-2xl p-5 mb-3 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text className="text-primary-foreground text-lg font-semibold ml-3">
            Take Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleChooseFromGallery}
          className="bg-card border-2 border-border rounded-2xl p-5 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons
            name="images"
            size={24}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
          <Text className="text-foreground text-lg font-semibold ml-3">
            Choose from Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
