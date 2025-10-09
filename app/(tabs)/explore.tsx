import { Text, View } from "react-native";

export default function ReceiptScanner() {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text style={{ color: "white", fontSize: 24 }}>
        Style prop works (red background)
      </Text>
      <View className="bg-blue-500 p-4 mt-4">
        <Text className="text-white text-2xl">
          Tailwind test (should be blue)
        </Text>
      </View>
    </View>
  );
}
