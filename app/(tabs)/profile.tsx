import { commonStyles } from "@/constants/styles";
import { translate } from "@/constants/textMappings";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/auth";
import { getUserReceipts } from "@/services/receiptService";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, loading } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalReceipts: 0,
    totalAmount: 0,
    avgAmount: 0,
    thisMonthAmount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: translate("Profile"),
      headerShown: true,
      headerStyle: {
        backgroundColor: isDark ? "#1f2937" : "#f9fafb",
      },
      headerTintColor: isDark ? "#f9fafb" : "#1f2937",
      headerRight: () => (
        <View>
          <TouchableOpacity
            onPress={() => {
              router.push("/settings");
            }}
            className="p-3 rounded-lg"
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isDark]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoadingStats(true);
      const receipts = await getUserReceipts(user.uid);

      // Calculate statistics
      const totalAmount = receipts.reduce(
        (sum, r) => sum + (r.totalAmount || 0),
        0
      );
      const avgAmount = receipts.length > 0 ? totalAmount / receipts.length : 0;

      // This month's spending
      const now = new Date();
      const thisMonthReceipts = receipts.filter((r) => {
        const receiptDate = new Date(r.receiptDate);
        return (
          receiptDate.getMonth() === now.getMonth() &&
          receiptDate.getFullYear() === now.getFullYear()
        );
      });
      const thisMonthAmount = thisMonthReceipts.reduce(
        (sum, r) => sum + (r.totalAmount || 0),
        0
      );

      setStats({
        totalReceipts: receipts.length,
        totalAmount,
        avgAmount,
        thisMonthAmount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(translate("LogOut"), translate("LogoutConfirm"), [
      {
        text: translate("Cancel"),
        style: "cancel",
      },
      {
        text: translate("LogOut"),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert("Coming Soon", "Account deletion feature coming soon");
          },
        },
      ]
    );
  };

  if (loading || !user) {
    return (
      <View
        className={`flex-1 justify-center items-center ${commonStyles.bgScreen}`}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className={`flex-1 ${commonStyles.bgScreen}`}>
      <View className="px-6 py-6">
        {/* User Info Card */}
        <View
          className={`${commonStyles.bg} rounded-2xl p-6 border-2 ${commonStyles.border} items-center mb-6`}
        >
          <View
            className={`w-24 h-24 rounded-full ${commonStyles.border} border-4 items-center justify-center mb-4`}
          >
            <Ionicons
              name="person"
              size={48}
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
          </View>
          <Text className={`${commonStyles.text} text-2xl font-bold`}>
            {user.displayName || "User"}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
            {user.email}
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            Member since{" "}
            {new Date(user.metadata.creationTime || "").toLocaleDateString(
              "nb-NO"
            )}
          </Text>
        </View>

        {/* Statistics Section */}
        <Text className={`${commonStyles.text} text-xl font-bold mb-3`}>
          Statistics
        </Text>

        {loadingStats ? (
          <View className="py-8">
            <ActivityIndicator size="small" color="#3b82f6" />
          </View>
        ) : (
          <View className="flex-row flex-wrap mb-6">
            {/* Total Receipts */}
            <View
              className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3 mr-3`}
              style={{ width: "47%" }}
            >
              <Ionicons name="receipt-outline" size={24} color="#3b82f6" />
              <Text className={`${commonStyles.text} text-2xl font-bold mt-2`}>
                {stats.totalReceipts}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Total Receipts
              </Text>
            </View>

            {/* Total Spent */}
            <View
              className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3`}
              style={{ width: "47%" }}
            >
              <Ionicons name="cash-outline" size={24} color="#10b981" />
              <Text className={`${commonStyles.text} text-2xl font-bold mt-2`}>
                {stats.totalAmount.toFixed(0)} kr
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Total Spent
              </Text>
            </View>

            {/* This Month */}
            <View
              className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3 mr-3`}
              style={{ width: "47%" }}
            >
              <Ionicons name="calendar-outline" size={24} color="#f59e0b" />
              <Text className={`${commonStyles.text} text-2xl font-bold mt-2`}>
                {stats.thisMonthAmount.toFixed(0)} kr
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                This Month
              </Text>
            </View>

            {/* Average */}
            <View
              className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3`}
              style={{ width: "47%" }}
            >
              <Ionicons name="trending-up-outline" size={24} color="#8b5cf6" />
              <Text className={`${commonStyles.text} text-2xl font-bold mt-2`}>
                {stats.avgAmount.toFixed(0)} kr
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Average
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <Text className={`${commonStyles.text} text-xl font-bold mb-3`}>
          Quick Actions
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="camera-outline"
              size={24}
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
            <Text className={`${commonStyles.text} text-lg font-semibold ml-3`}>
              Scan Receipt
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/receipts")}
          className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="list-outline"
              size={24}
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
            <Text className={`${commonStyles.text} text-lg font-semibold ml-3`}>
              View All Receipts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Coming Soon", "Export feature coming soon")
          }
          className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-6 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="download-outline"
              size={24}
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
            <Text className={`${commonStyles.text} text-lg font-semibold ml-3`}>
              Export Data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Account Management */}
        <Text className={`${commonStyles.text} text-xl font-bold mb-3`}>
          Account
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          className={`${commonStyles.bg} rounded-xl p-4 border ${commonStyles.border} mb-3 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text className="text-red-500 text-lg font-semibold ml-3">
              Logout
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          className={`${commonStyles.bg} rounded-xl p-4 border border-red-500 mb-6 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            <Text className="text-red-500 text-lg font-semibold ml-3">
              Delete Account
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
