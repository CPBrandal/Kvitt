import { commonStyles } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { useTranslate } from "@/hooks/useTranslate";
import { deleteReceipt, getUserReceipts } from "@/services/receiptService";
import { Receipt } from "@/types/receipts";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function ReceiptScanner() {
  const { user } = useAuth();
  const translate = useTranslate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadReceipts();
    }
  }, [user]);

  const loadReceipts = async (isRefresh = false) => {
    if (!user) return;

    try {
      if (!isRefresh) {
        setLoading(true);
      }
      const fetchedReceipts = await getUserReceipts(user.uid);
      setReceipts(fetchedReceipts);
    } catch (error) {
      console.error("Error loading receipts:", error);
    } finally {
      if (!isRefresh) {
        setLoading(false);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // Add haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await loadReceipts(true);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  const handleDelete = (receiptId: string, sellerName: string) => {
    Alert.alert(
      translate("DeleteReceipt"),
      `${translate("DeleteReceiptConfirm")} ${sellerName}?`,
      [
        {
          text: translate("Cancel"),
          style: "cancel",
        },
        {
          text: translate("Delete"),
          style: "destructive",
          onPress: async () => {
            try {
              // Haptic feedback
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              await deleteReceipt(receiptId);
              setReceipts((prev) => prev.filter((r) => r.id !== receiptId));
              Alert.alert("Success", translate("SuccessDeleteReceipt"));
            } catch (error) {
              console.error("Error deleting receipt:", error);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", translate("FailureDeleteReceipt"));
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number, currency: string = "NOK") => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("nb-NO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderRightActions = (receipt: Receipt) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(receipt.id, receipt.sellerName)}
        className="bg-red-500 justify-center items-center px-6 rounded-xl mb-3 ml-3"
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
        <Text className="text-white font-semibold mt-1">
          {translate("Delete")}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderReceiptItem = useCallback(
    ({ item }: { item: Receipt }) => (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        overshootRight={false}
      >
        <TouchableOpacity
          onPress={() => router.push(`/receipt-detail/${item.id}`)}
          className={`${commonStyles.bg} rounded-xl p-4 mb-3 border ${commonStyles.border}`}
          activeOpacity={0.7}
        >
          <View className="flex-row justify-between items-start">
            {/* Left side - Store info */}
            <View className="flex-1 mr-3">
              <Text
                className={`${commonStyles.text} text-lg font-semibold`}
                numberOfLines={1}
              >
                {item.sellerName || translate("UnknownStore")}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {formatDate(item.receiptDate)}
              </Text>
              {item.receiptNumber && (
                <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  #{item.receiptNumber}
                </Text>
              )}
            </View>

            {/* Right side - Price and arrow */}
            <View className="items-end">
              <Text className={`${commonStyles.text} text-lg font-bold`}>
                {formatCurrency(item.totalAmount, item.currency)}
              </Text>
              {item.items && item.items.length > 0 && (
                <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {item.items.length}{" "}
                  {item.items.length === 1
                    ? translate("Item")
                    : translate("Items")}
                </Text>
              )}
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9ca3af"
                style={{ marginTop: 4 }}
              />
            </View>
          </View>

          {/* VAT indicator */}
          {item.hasVAT && item.vatAmount && (
            <View className="flex-row items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {translate("VAT")}:{" "}
                {formatCurrency(item.vatAmount, item.currency)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    ),
    [translate]
  );

  if (loading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${commonStyles.bgScreen}`}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`${commonStyles.text} mt-4`}>
          {translate("LoadingReceipts")}
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${commonStyles.bgScreen}`}>
      {/* Header */}
      <View className="px-6 pt-16 pb-4">
        <Text className={`text-3xl font-bold ${commonStyles.text}`}>
          {translate("Receipts")}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          {receipts.length}{" "}
          {receipts.length === 1
            ? translate("Receipt").toLowerCase()
            : translate("Receipts").toLowerCase()}
        </Text>
      </View>

      {/* Receipt List */}
      {receipts.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="receipt-outline" size={64} color="#9ca3af" />
          <Text className={`${commonStyles.text} text-xl font-semibold mt-4`}>
            {translate("NoReceipts")}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
            {translate("ScanYourFirstReceipt")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={receipts}
          renderItem={renderReceiptItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
              colors={["#3b82f6"]}
              progressBackgroundColor="#ffffff"
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />
      )}
    </View>
  );
}
