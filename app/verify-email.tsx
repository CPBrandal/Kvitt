import { useAuth } from "@/context/AuthContext";
import { logout, reloadUser, resendVerificationEmail } from "@/services/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyEmailScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Redirect if already verified
    if (user?.emailVerified) {
      router.replace("/");
    }
  }, [user]);

  const handleResendEmail = async () => {
    setLoading(true);
    const result = await resendVerificationEmail();
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", result.message || "Verification email sent!");
    } else {
      Alert.alert("Error", result.error || "Failed to send email");
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    const result = await reloadUser();
    setChecking(false);

    if (result.success && result.emailVerified) {
      Alert.alert("Success", "Email verified! You can now use the app.", [
        { text: "Continue", onPress: () => router.replace("/") },
      ]);
    } else {
      Alert.alert(
        "Not Verified",
        "Please check your email and click the verification link."
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950 justify-center p-6">
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
        <Text className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-50">
          📧 Verify Your Email
        </Text>

        <Text className="text-center mb-6 text-gray-600 dark:text-gray-400">
          We've sent a verification email to:
        </Text>

        <Text className="text-center font-bold mb-8 text-gray-900 dark:text-gray-50">
          {user?.email}
        </Text>

        <Text className="text-center mb-8 text-gray-600 dark:text-gray-400">
          Please click the link in the email to verify your account.
        </Text>

        {/* Check Verification Button */}
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 mb-4"
          onPress={handleCheckVerification}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              I've Verified My Email
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend Email Button */}
        <TouchableOpacity
          className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 mb-4"
          onPress={handleResendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-gray-900 dark:text-gray-50 text-center font-bold">
              Resend Verification Email
            </Text>
          )}
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-blue-500 text-center mt-4">
            Log out and use a different email
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
