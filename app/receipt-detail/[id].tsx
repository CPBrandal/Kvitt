import { LoadingModal } from "@/components/loadingModal";
import { bgColors, commonStyles } from "@/constants/styles";
import { useTranslate } from "@/hooks/useTranslate";
import { generateReceiptPDF } from "@/services/pdfService";
import { getReceiptById } from "@/services/receiptService";
import { Receipt } from "@/types/receipts";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageView from "react-native-image-viewing";

export default function ReceiptDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const translate = useTranslate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isExporting, setIsExporting] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

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

  const exportReceiptAsPDF = async () => {
    if (!receipt) return;

    try {
      // Haptic feedback
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Generate PDF
      await generateReceiptPDF(receipt);
      setIsExporting(false);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        translate("Success"),
        translate("PDFExported") || "Receipt exported as PDF!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("PDF Export Error:", error);

      // Hide loading modal
      setIsExporting(false);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", translate("PDFExportFailed"), [{ text: "OK" }]);
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
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: isDark ? bgColors.swamp : bgColors.porcelain,
        }}
      >
        <ActivityIndicator
          size="large"
          color={
            isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
          }
        />
        <Text className={`${commonStyles.text} mt-4`}>
          {translate("LoadingReceipts")}
        </Text>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: isDark ? bgColors.swamp : bgColors.porcelain,
        }}
      >
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className={`${commonStyles.text} text-xl font-semibold mt-4`}>
          {translate("ReceiptNotFound")}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-lg"
          style={{
            backgroundColor: isDark
              ? commonStyles.secondary
              : commonStyles.primary,
          }}
        >
          <Text className="text-white font-semibold">
            {translate("GoBack")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark ? bgColors.swamp : bgColors.cream,
      }}
    >
      <ImageView
        images={[{ uri: receipt.imageUrl }]}
        imageIndex={2}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        swipeToCloseEnabled={true}
      />
      {/* Header */}
      <View className="px-6 pt-16 pb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={
              isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            exportReceiptAsPDF();
          }}
          className="ml-4"
        >
          <Text
            className="font-semibold text-right"
            style={{
              color: isDark
                ? commonStyles.imgColorDark
                : commonStyles.imgColorLight,
            }}
          >
            {translate("ExportToPDF")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Receipt Image */}
        {receipt.imageUrl && (
          <TouchableOpacity
            onPress={() => setImageViewerVisible(true)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: receipt.imageUrl }}
              className="w-full h-96 rounded-xl mb-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {/* Store Info Card */}
        <View
          className={`${commonStyles.bg} rounded-xl p-4 mb-4 border ${commonStyles.border}`}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {translate("Store")}
          </Text>
          <Text className={`${commonStyles.text} text-2xl font-bold`}>
            {receipt.sellerName || translate("UnknownStore")}
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
            <Text className="text-gray-500 dark:text-gray-400">
              {translate("Date")}
            </Text>
            <Text className={`${commonStyles.text} font-semibold`}>
              {formatDate(receipt.receiptDate)}
            </Text>
          </View>
          {receipt.receiptNumber && (
            <View className="flex-row justify-between">
              <Text className="text-gray-500 dark:text-gray-400">
                {translate("Receipt")} #
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
              {translate("Items")} ({receipt.items.length})
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
                      {translate("Qty")}: {item.quantity}
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
        <LoadingModal
          visible={isExporting}
          message={translate("GeneratingPDF")}
        />
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
              <Text className="text-gray-500 dark:text-gray-400">
                {translate("VAT")}
              </Text>
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
