import React from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  visible,
  message,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-6 items-center min-w-[200px] shadow-lg">
          <ActivityIndicator size="large" color="#007AFF" />
          {message && (
            <Text className="mt-4 text-base text-gray-800 text-center">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};
