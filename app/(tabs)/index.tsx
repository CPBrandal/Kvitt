import { commonStyles } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslate } from "@/hooks/useTranslate";
import { logout } from "@/services/auth";
import { parseReceiptImage } from "@/services/receiptParserService";
import { createReceipt } from "@/services/receiptService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const translate = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();
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
        allowsEditing: false,
        quality: 1,
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

  const handleReceiptCapture = async (imageUri: string) => {
    try {
      setIsLoading(true);

      // Parse receipt with GPT-4
      const parsed = await parseReceiptImage(imageUri);

      console.log("Parsed receipt:", parsed);

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
        imageUri
      );
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
        quality: 1,
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

  return (
    <View className={`flex-1 ${commonStyles.bgScreen}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {isLoading && (
        <View className="absolute inset-0 z-50 bg-black/50 justify-center items-center">
          <View className={`${commonStyles.bg} rounded-2xl p-8 items-center`}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className={`${commonStyles.text} mt-4 text-lg font-semibold`}>
              {translate("ProcessingReceipt")}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
              {translate("ThisMightTakeFewSeconds")}
            </Text>
          </View>
        </View>
      )}
      {/* Header with Theme Toggle */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center justify-between">
          <Text className={`text-3xl font-bold ${commonStyles.text}`}>
            Kvitt
          </Text>

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
              } else {
                router.push("/login");
              }
            }}
            className="p-3 rounded-lg"
          >
            <Ionicons
              name={user ? "log-out" : "log-in"}
              size={24}
              color={
                isDark ? commonStyles.imgColorDark : commonStyles.imgColorLight
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Centered */}
      <View className="flex-1 justify-center px-6">
        {/* Theme Indicator */}
        <View
          className={`${commonStyles.bg} rounded-2xl p-8 border-2 ${commonStyles.border} items-center mb-8`}
        >
          <Text
            className={`${commonStyles.text} text-2xl font-bold mt-4 text-center`}
          >
            {translate("Hello")}, {user.displayName}!
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
            {translate("TakePicture")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleChooseFromGallery}
          className={`${commonStyles.bg} border-2 ${commonStyles.border} rounded-2xl p-5 flex-row items-center justify-center`}
          activeOpacity={0.8}
        >
          <Ionicons
            name="images"
            size={24}
            color={
              isDark
                ? `${commonStyles.imgColorDark}`
                : `${commonStyles.imgColorLight}`
            }
          />
          <Text className={`${commonStyles.text} text-lg font-semibold ml-3`}>
            {translate("UploadFromGallery")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${commonStyles.bg} border-2 ${commonStyles.border} rounded-2xl p-5 flex-row items-center justify-center`}
          onPress={() => {
            router.push("/signup");
          }}
        >
          <Text>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
