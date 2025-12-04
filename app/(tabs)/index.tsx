import { CUSTOM_PALETTE } from "@/constants/colors";
import { commonStyles } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { useTranslate } from "@/hooks/useTranslate";
import { logout } from "@/services/auth";
import {
  optimizeImageForUpload,
  parseReceiptImage,
} from "@/services/receiptParserService";
import { createReceipt, getUserReceipts } from "@/services/receiptService";
import { Receipt } from "@/types/receipts";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const translate = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalReceipts: 0,
    totalAmount: 0,
    thisMonthAmount: 0,
  });
  const [recentReceipts, setRecentReceipts] = useState<Receipt[]>([]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!user.emailVerified) {
        router.replace("/verify-email");
      }
    }
  }, [user, loading]);

  useFocusEffect(
    useCallback(() => {
      if (user && !loading) {
        loadStats();
      }
    }, [user, loading])
  );

  const loadStats = async () => {
    if (!user) return;
    try {
      setLoadingStats(true);
      const receipts = await getUserReceipts(user.uid);

      // Calculate stats
      const totalAmount = receipts.reduce(
        (sum, r) => sum + (r.totalAmount || 0),
        0
      );

      // Calculate this month's spending
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthAmount = receipts
        .filter((r) => {
          const receiptDate = r.receiptDate
            ? new Date(r.receiptDate)
            : r.createdAt
            ? new Date(r.createdAt)
            : null;
          return receiptDate && receiptDate >= startOfMonth;
        })
        .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

      setStats({
        totalReceipts: receipts.length,
        totalAmount,
        thisMonthAmount,
      });

      // Get recent receipts (last 5)
      const sorted = [...receipts].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setRecentReceipts(sorted.slice(0, 5));
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <View>
        <Text>{translate("Loading")}</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert(translate("CameraPermissionAlert"));
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        handleReceiptCapture(uri);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleReceiptCapture = async (imageUri: string) => {
    try {
      setIsLoading(true);
      console.log("🔄 Optimizing image...");
      const optimizedImageUri = await optimizeImageForUpload(imageUri);

      console.log("📄 Parsing receipt...");
      const parsed = await parseReceiptImage(imageUri, optimizedImageUri);

      //console.log("Parsed receipt:", parsed);
      const receiptId = await createReceipt(
        user!.uid,
        user!.email!,
        {
          sellerName: parsed.sellerName || "",
          sellerOrgNumber: parsed.sellerOrgNumber,
          sellerAddress: parsed.sellerAddress,
          totalAmount: parsed.totalAmount || 0,
          subtotal: parsed.subtotal,
          vatAmount: parsed.vatAmount,
          currency: parsed.currency || "NOK",
          receiptDate: parsed.receiptDate
            ? new Date(parsed.receiptDate)
            : new Date(),
          receiptNumber: parsed.receiptNumber,
          items: parsed.items.map((item, index) => ({
            ...item,
            id: `${Date.now()}-${index}`,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0,
          })),
          paymentMethod:
            (parsed.paymentMethod?.toLowerCase() as
              | "card"
              | "cash"
              | "mobile"
              | "invoice"
              | "other"
              | undefined) || "other",
          ocrRawText: parsed.rawText,
          ocrConfidence: parsed.confidence,
          hasVAT: (parsed.vatAmount || 0) > 0,
        },
        imageUri,
        optimizedImageUri // Pass optimized image to avoid re-processing
      );

      console.log("✅ Receipt created successfully:", receiptId);

      // Refresh stats after successful upload
      await loadStats();

      // Navigate to receipts tab to see the new receipt
      router.push("/(tabs)/receipts");
    } catch (error) {
      console.error("Error processing receipt:", error);
      Alert.alert("Error", "Failed to process receipt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChooseFromGallery = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert(translate("GalleryPermissionAlert"));
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8, // Reduced from 1.0 for faster processing
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri);
        handleReceiptCapture(uri);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(0)} kr`;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const receiptDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (receiptDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (receiptDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return receiptDate.toLocaleDateString("nb-NO", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <View className={`flex-1 ${commonStyles.bgScreen}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {isLoading && (
        <View className="absolute inset-0 z-50 bg-black/60 justify-center items-center backdrop-blur-sm">
          <View
            className={`${commonStyles.bg} rounded-3xl p-10 items-center min-w-[280px]`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 20,
            }}
          >
            <ActivityIndicator
              size="large"
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
            <Text className={`${commonStyles.text} mt-6 text-xl font-bold`}>
              {translate("ProcessingReceipt")}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center text-base">
              {translate("ThisMightTakeFewSeconds")}
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header with Gradient Background */}
        <View
          className="pt-20 pb-8 px-6"
          style={{
            backgroundColor: isDark
              ? CUSTOM_PALETTE.rgb.swamp
              : CUSTOM_PALETTE.rgb.porcelain,
          }}
        >
          <View className="flex-row items-start justify-between mb-6">
            <View className="flex-1">
              <Text
                className={`text-4xl font-extrabold ${commonStyles.text} mb-2`}
              >
                {translate("Hello")},{" "}
                {user?.displayName?.split(" ")[0] || "there"}!
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-base">
                {translate("WelcomeBack")}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (user) {
                  Alert.alert(
                    translate("SignOut"),
                    translate("AreYouSureYouWantToLogOut"),
                    [
                      {
                        text: translate("Cancel"),
                        style: "cancel",
                      },
                      {
                        text: translate("LogOut"),
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await logout();
                            router.replace("/login");
                          } catch (error) {
                            console.error("Logout error:", error);
                            Alert.alert(
                              "Error",
                              "Failed to logout. Please try again."
                            );
                          }
                        },
                      },
                    ]
                  );
                }
              }}
              className={`p-3 rounded-full ${
                isDark ? "bg-gray-800/50" : "bg-white/80"
              }`}
              style={{
                backgroundColor: isDark
                  ? "rgba(1, 27, 40, 0.5)"
                  : "rgba(255, 255, 255, 0.8)",
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={
                  isDark
                    ? CUSTOM_PALETTE.rgb.smaltBlue
                    : CUSTOM_PALETTE.rgb.deepSeaGreen
                }
              />
            </TouchableOpacity>
          </View>

          {/* Hero Stat Card */}
          {!loadingStats && (
            <View
              className={`${commonStyles.bg} rounded-3xl p-6 mb-2`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <Text
                className="text-sm font-medium mb-2"
                style={{
                  color: isDark
                    ? "rgba(241, 244, 245, 0.7)"
                    : CUSTOM_PALETTE.rgb.tarawera,
                }}
              >
                {translate("TotalSpent") || "Total Spent"}
              </Text>
              <Text className={`${commonStyles.text} text-5xl font-black mb-1`}>
                {formatCurrency(stats.totalAmount)}
              </Text>
              <View className="flex-row items-center gap-4 mt-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="receipt-outline"
                    size={16}
                    color={
                      isDark
                        ? CUSTOM_PALETTE.rgb.smaltBlue
                        : CUSTOM_PALETTE.rgb.deepSeaGreen
                    }
                  />
                  <Text
                    className="text-sm ml-1.5"
                    style={{
                      color: isDark
                        ? "rgba(241, 244, 245, 0.7)"
                        : CUSTOM_PALETTE.rgb.tarawera,
                    }}
                  >
                    {stats.totalReceipts}{" "}
                    {translate("TotalReceipts") || "receipts"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={
                      isDark
                        ? CUSTOM_PALETTE.rgb.smaltBlue
                        : CUSTOM_PALETTE.rgb.deepSeaGreen
                    }
                  />
                  <Text
                    className="text-sm ml-1.5"
                    style={{
                      color: isDark
                        ? "rgba(241, 244, 245, 0.7)"
                        : CUSTOM_PALETTE.rgb.tarawera,
                    }}
                  >
                    {formatCurrency(stats.thisMonthAmount)}{" "}
                    {translate("ThisMonth") || "this month"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {loadingStats && (
            <View className="py-8">
              <ActivityIndicator
                size="small"
                color={
                  isDark
                    ? commonStyles.imgColorDark
                    : commonStyles.imgColorLight
                }
              />
            </View>
          )}
        </View>

        {/* Action Buttons - Side by Side */}
        <View className="px-6 mb-8">
          <Text className={`${commonStyles.text} text-lg font-bold mb-4`}>
            Add Receipt
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="flex-1 rounded-2xl p-6 items-center justify-center"
              activeOpacity={0.85}
              style={{
                backgroundColor: isDark
                  ? commonStyles.secondary
                  : commonStyles.primary,
                shadowColor: isDark
                  ? commonStyles.secondary
                  : commonStyles.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <View className="bg-white/25 rounded-full p-4 mb-3">
                <Ionicons name="camera" size={28} color="white" />
              </View>
              <Text className="text-white text-base font-bold">
                {translate("TakePicture")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleChooseFromGallery}
              className={`flex-1 ${commonStyles.bg} rounded-2xl p-6 items-center justify-center border-2 ${commonStyles.border}`}
              activeOpacity={0.7}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <View
                className="rounded-full p-4 mb-3"
                style={{
                  backgroundColor: isDark
                    ? CUSTOM_PALETTE.rgb.daintreeLight
                    : CUSTOM_PALETTE.rgb.porcelain,
                }}
              >
                <Ionicons
                  name="images-outline"
                  size={28}
                  color={
                    isDark
                      ? CUSTOM_PALETTE.rgb.smaltBlue
                      : CUSTOM_PALETTE.rgb.deepSeaGreen
                  }
                />
              </View>
              <Text className={`${commonStyles.text} text-base font-bold`}>
                {translate("UploadFromGallery")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Receipts */}
        {recentReceipts.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-5">
              <Text className={`${commonStyles.text} text-2xl font-bold`}>
                Recent Receipts
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/receipts")}
                className="flex-row items-center"
                activeOpacity={0.7}
              >
                <Text
                  className="text-sm font-semibold mr-1"
                  style={{
                    color: isDark
                      ? commonStyles.imgColorDark
                      : commonStyles.imgColorLight,
                  }}
                >
                  View all
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    isDark
                      ? commonStyles.imgColorDark
                      : commonStyles.imgColorLight
                  }
                />
              </TouchableOpacity>
            </View>

            {recentReceipts.slice(0, 3).map((receipt) => (
              <TouchableOpacity
                key={receipt.id}
                onPress={() => router.push(`/receipt-detail/${receipt.id}`)}
                className={`${commonStyles.bg} rounded-2xl p-5 mb-3 border ${commonStyles.border} flex-row items-center`}
                activeOpacity={0.7}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  className="rounded-xl p-3 mr-4"
                  style={{
                    backgroundColor: isDark
                      ? CUSTOM_PALETTE.rgb.daintreeLight
                      : CUSTOM_PALETTE.rgb.porcelain,
                  }}
                >
                  <Ionicons
                    name="receipt"
                    size={24}
                    color={
                      isDark
                        ? commonStyles.imgColorDark
                        : commonStyles.imgColorLight
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`${commonStyles.text} font-bold text-base mb-1`}
                    numberOfLines={1}
                  >
                    {receipt.sellerName || translate("UnknownStore")}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDate(
                      receipt.receiptDate
                        ? new Date(receipt.receiptDate)
                        : receipt.createdAt
                        ? new Date(receipt.createdAt)
                        : undefined
                    )}
                  </Text>
                </View>
                <View className="items-end ml-3">
                  <Text className={`${commonStyles.text} font-bold text-lg`}>
                    {formatCurrency(receipt.totalAmount || 0)}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9ca3af"
                    style={{ marginTop: 6 }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loadingStats && stats.totalReceipts === 0 && (
          <View className="px-6 mt-4">
            <View
              className={`${commonStyles.bg} rounded-3xl p-12 items-center border ${commonStyles.border}`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.2 : 0.05,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <View
                className="rounded-full p-6 mb-6"
                style={{
                  backgroundColor: isDark
                    ? CUSTOM_PALETTE.rgb.daintreeLight
                    : CUSTOM_PALETTE.rgb.porcelain,
                }}
              >
                <Ionicons
                  name="receipt-outline"
                  size={56}
                  color={
                    isDark
                      ? commonStyles.imgColorDark
                      : commonStyles.imgColorLight
                  }
                />
              </View>
              <Text
                className={`${commonStyles.text} text-2xl font-bold mt-2 text-center mb-2`}
              >
                No receipts yet
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center text-base">
                Start by scanning your first receipt
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
