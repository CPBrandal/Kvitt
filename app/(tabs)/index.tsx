import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [recentReceipts, setRecentReceipts] = useState([
    { id: 1, name: "Grocery Store", amount: "$45.23", date: "Oct 8, 2025" },
    { id: 2, name: "Gas Station", amount: "$52.10", date: "Oct 7, 2025" },
    { id: 3, name: "Restaurant", amount: "$28.50", date: "Oct 6, 2025" },
  ]);

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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6 bg-card border-b border-border">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-3xl font-bold text-foreground">
                Receipt Scanner
              </Text>
              <Text className="text-muted-foreground mt-1">
                Capture and organize receipts
              </Text>
            </View>

            {/* Theme Toggle */}
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={20}
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

        {/* Action Buttons */}
        <View className="px-6 mt-6">
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="bg-primary rounded-2xl p-5 mb-4 active:opacity-80 flex-row items-center justify-center shadow-sm"
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text className="text-primary-foreground text-lg font-semibold ml-3">
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleChooseFromGallery}
            className="bg-card border-2 border-border rounded-2xl p-5 active:bg-muted flex-row items-center justify-center"
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

        {/* Stats Section */}
        <View className="px-6 mt-8">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-card rounded-xl p-4 border border-border">
              <Text className="text-muted-foreground text-sm">This Month</Text>
              <Text className="text-foreground text-2xl font-bold mt-1">
                12
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                Receipts
              </Text>
            </View>

            <View className="flex-1 bg-card rounded-xl p-4 border border-border">
              <Text className="text-muted-foreground text-sm">Total Spent</Text>
              <Text className="text-foreground text-2xl font-bold mt-1">
                $328
              </Text>
              <Text className="text-muted-foreground text-xs mt-1">
                October 2025
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Receipts */}
        <View className="px-6 mt-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">
              Recent Receipts
            </Text>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {recentReceipts.length === 0 ? (
            <View className="bg-card rounded-xl p-8 border border-border items-center">
              <Ionicons
                name="receipt-outline"
                size={48}
                color={isDark ? "#4b5563" : "#9ca3af"}
              />
              <Text className="text-muted-foreground mt-3 text-center">
                No receipts yet
              </Text>
              <Text className="text-muted-foreground text-sm mt-1 text-center">
                Tap "Take Photo" to scan your first receipt
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentReceipts.map((receipt) => (
                <TouchableOpacity
                  key={receipt.id}
                  className="bg-card rounded-xl p-4 border border-border active:bg-muted flex-row items-center"
                  activeOpacity={0.8}
                >
                  <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
                    <Ionicons
                      name="receipt"
                      size={24}
                      color={isDark ? "#3b82f6" : "#2563eb"}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-foreground font-semibold text-base">
                      {receipt.name}
                    </Text>
                    <Text className="text-muted-foreground text-sm mt-0.5">
                      {receipt.date}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-foreground font-bold text-lg">
                      {receipt.amount}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={isDark ? "#6b7280" : "#9ca3af"}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-foreground mb-4">
            Quick Actions
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-card rounded-xl p-4 border border-border active:bg-muted items-center">
              <View className="w-12 h-12 bg-accent/10 rounded-full items-center justify-center mb-2">
                <Ionicons
                  name="document-text"
                  size={24}
                  color={isDark ? "#f472b6" : "#ec4899"}
                />
              </View>
              <Text className="text-foreground font-semibold text-sm text-center">
                Export PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-card rounded-xl p-4 border border-border active:bg-muted items-center">
              <View className="w-12 h-12 bg-secondary/10 rounded-full items-center justify-center mb-2">
                <Ionicons
                  name="stats-chart"
                  size={24}
                  color={isDark ? "#60a5fa" : "#3b82f6"}
                />
              </View>
              <Text className="text-foreground font-semibold text-sm text-center">
                Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-card rounded-xl p-4 border border-border active:bg-muted items-center">
              <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-2">
                <Ionicons
                  name="settings"
                  size={24}
                  color={isDark ? "#3b82f6" : "#2563eb"}
                />
              </View>
              <Text className="text-foreground font-semibold text-sm text-center">
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
