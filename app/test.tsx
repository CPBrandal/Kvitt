import Constants from "expo-constants";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, ScrollView, Text, View } from "react-native";

export default function TestGoogleVision() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const GOOGLE_CLOUD_API_KEY = Constants.expoConfig?.extra?.googleCloudApiKey;

  const testAPI = async () => {
    try {
      setLoading(true);

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });

      if (pickerResult.canceled) {
        setLoading(false);
        return;
      }

      const imageUri = pickerResult.assets[0].uri;
      console.log("Image URI:", imageUri);

      // Use image manipulator to save and get base64
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [], // No manipulations, just convert
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true, // Get base64 output
        }
      );

      const base64Image = manipResult.base64;

      if (!base64Image) {
        throw new Error("Failed to convert image to base64");
      }

      console.log("Image converted to base64, length:", base64Image.length);

      // Call Google Cloud Vision API
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
      setLoading(false);

      Alert.alert("Success!", "Text extracted from image");
    } catch (error) {
      console.error("Full Error:", error);
      setLoading(false);

      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <View className="flex-1 p-6 justify-center bg-white dark:bg-gray-950">
      <Text className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-50">
        Test Google Vision API
      </Text>

      <Button
        title={loading ? "Processing..." : "Select Image & Test API"}
        onPress={testAPI}
        disabled={loading}
      />

      {result ? (
        <ScrollView className="mt-6 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg max-h-96">
          <Text className="text-sm font-mono text-gray-900 dark:text-gray-50">
            {result}
          </Text>
        </ScrollView>
      ) : null}
    </View>
  );
}
