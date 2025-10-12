import { commonStyles } from "@/constants/styles";
import { useTranslate } from "@/hooks/useTranslate";
import { getReceiptById } from "@/services/receiptService";
import { Receipt } from "@/types/receipts";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReceiptDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const translate = useTranslate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const fetchedReceipt = await getReceiptById(id);
      setReceipt(fetchedReceipt);
    } catch (error) {
      console.error("Error loading receipt:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "NOK") => {
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("nb-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${commonStyles.bgScreen}`}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={`${commonStyles.text} mt-4`}>Loading receipt...</Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View
        className={`flex-1 justify-center items-center ${commonStyles.bgScreen}`}
      >
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className={`${commonStyles.text} text-xl font-semibold mt-4`}>
          Receipt not found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${commonStyles.bgScreen}`}>
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons
            name="arrow-back"
            size={24}
            color={commonStyles.imgColorLight}
          />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${commonStyles.text} flex-1`}>
          Receipt Details
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Receipt Image */}
        {receipt.imageUrl && (
          <Image
            source={{ uri: receipt.imageUrl }}
            className="w-full h-96 rounded-xl mb-6"
            resizeMode="contain"
          />
        )}

        {/* Store Info Card */}
        <View
          className={`${commonStyles.bg} rounded-xl p-4 mb-4 border ${commonStyles.border}`}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            Store
          </Text>
          <Text className={`${commonStyles.text} text-2xl font-bold`}>
            {receipt.sellerName || "Unknown Store"}
          </Text>
          {receipt.sellerAddress && (
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {receipt.sellerAddress}
            </Text>
          )}
          {receipt.sellerOrgNumber && (
            <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Org: {receipt.sellerOrgNumber}
            </Text>
          )}
        </View>

        {/* Date and Receipt Number */}
        <View
          className={`${commonStyles.bg} rounded-xl p-4 mb-4 border ${commonStyles.border}`}
        >
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 dark:text-gray-400">Date</Text>
            <Text className={`${commonStyles.text} font-semibold`}>
              {formatDate(receipt.receiptDate)}
            </Text>
          </View>
          {receipt.receiptNumber && (
            <View className="flex-row justify-between">
              <Text className="text-gray-500 dark:text-gray-400">
                Receipt #
              </Text>
              <Text className={`${commonStyles.text} font-semibold`}>
                {receipt.receiptNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Items List */}
        {receipt.items && receipt.items.length > 0 && (
          <View
            className={`${commonStyles.bg} rounded-xl p-4 mb-4 border ${commonStyles.border}`}
          >
            <Text className={`${commonStyles.text} text-lg font-bold mb-4`}>
              Items ({receipt.items.length})
            </Text>
            {receipt.items.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <View className="flex-1">
                  <Text className={`${commonStyles.text} font-medium`}>
                    {item.name}
                  </Text>
                  {item.quantity && (
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      Qty: {item.quantity}
                    </Text>
                  )}
                </View>
                <Text className={`${commonStyles.text} font-semibold`}>
                  {formatCurrency(item.totalPrice || 0, receipt.currency)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Total Summary */}
        <View
          className={`${commonStyles.bg} rounded-xl p-4 mb-6 border ${commonStyles.border}`}
        >
          {receipt.subtotal && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 dark:text-gray-400">Subtotal</Text>
              <Text className={`${commonStyles.text}`}>
                {formatCurrency(receipt.subtotal, receipt.currency)}
              </Text>
            </View>
          )}
          {receipt.vatAmount && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 dark:text-gray-400">VAT</Text>
              <Text className={`${commonStyles.text}`}>
                {formatCurrency(receipt.vatAmount, receipt.currency)}
              </Text>
            </View>
          )}
          <View className="flex-row justify-between pt-3 border-t-2 border-gray-300 dark:border-gray-600">
            <Text className={`${commonStyles.text} text-xl font-bold`}>
              Total
            </Text>
            <Text className={`${commonStyles.text} text-xl font-bold`}>
              {formatCurrency(receipt.totalAmount, receipt.currency)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
