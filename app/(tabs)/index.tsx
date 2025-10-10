import { commonStyles } from "@/constants/styles";
import { translate } from "@/constants/textMappings";
import { useAuth } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { logout } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const GOOGLE_CLOUD_API_KEY = Constants.expoConfig?.extra?.googleCloudApiKey;
  const { user, loading } = useAuth();

  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  //const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
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
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri);
        googleVision(uri);
      }
    } catch (error) {
      console.log("Error:", error);
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
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log("Image URI:", uri);
        googleVision(uri);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  async function googleVision(imageUri: string) {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(imageUri, [], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      });

      const base64Image = manipResult.base64;

      if (!base64Image) {
        throw new Error("Failed to convert image to base64");
      }

      console.log("Image converted to base64, length:", base64Image.length);

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                  },
                ],
              },
            ],
          }),
        }
      );

      console.log("API Response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(`API Error: ${JSON.stringify(data)}`);
      }

      if (data.responses[0]?.error) {
        throw new Error(`Vision API Error: ${data.responses[0].error.message}`);
      }

      const detectedText =
        data.responses[0]?.fullTextAnnotation?.text || "No text detected";

      console.log("Detected text:", detectedText);

      setResult(detectedText);
      //setLoading(false);

      Alert.alert("Success!", "Text extracted from image");
    } catch (error) {
      console.error("Full Error:", error);
      //setLoading(false);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <View className={`flex-1 ${commonStyles.bgScreen}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header with Theme Toggle */}
      <View className="px-6 pt-16 pb-6">
        <View className="flex-row items-center justify-between">
          <Text className={`text-3xl font-bold ${commonStyles.text}`}>
            Kvitt
          </Text>

          {/* Theme Toggle */}
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={24}
              color={
                isDark
                  ? `${commonStyles.imgColorDark}`
                  : `${commonStyles.imgColorLight}`
              }
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
      <Text
        className={`${commonStyles.text} text-2xl font-bold mt-4 text-center`}
      >
        {translate("Hello")}, {user.displayName}!
      </Text>

      {/* Main Content - Centered */}
      <View className="flex-1 justify-center px-6">
        {/* Theme Indicator */}
        <View
          className={`${commonStyles.bg} rounded-2xl p-8 border-2 ${commonStyles.border} items-center mb-8`}
        >
          <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={64}
            color={
              isDark
                ? `${commonStyles.imgColorDark}`
                : `${commonStyles.imgColorLight}`
            }
          />
          <Text className={`${commonStyles.text} text-2xl font-bold mt-4`}>
            {isDark ? "Dark Mode" : "Light Mode"}
          </Text>
          <TouchableOpacity
            className="bg-blue-600 dark:bg-blue-500 rounded-2xl p-5 mb-3 flex-row items-center justify-center"
            onPress={async () => {
              await logout();
              router.replace("/login");
            }}
          >
            <Text className={`${commonStyles.text}`}>
              {translate("LogOut")}
            </Text>
          </TouchableOpacity>
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
        {result ? (
          <ScrollView className="mt-6 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg max-h-96">
            <Text className={`${commonStyles.text} text-sm font-mono `}>
              {result}
            </Text>
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}
