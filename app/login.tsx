import { commonStyles } from "@/constants/styles";
import { translate } from "@/constants/textMappings";
import { signIn, useGoogleAuth, signInWithGoogle } from "@/services/auth"; // All from auth.ts now
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Sign-In
  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    setLoading(true);
    const result = await signInWithGoogle(idToken);
    setLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      Alert.alert(translate("LogInFailed"), result.error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", translate("PleaseFillAllFields"));
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      Alert.alert(translate("LogInFailed"), result.error);
    }
  };

  return (
    <View className={`${commonStyles.bgScreen} flex-1 justify-center`}>
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 mb-8 justifyContent-center">
        <Text className="font-bold mb-10 text-center text-2xl text-gray-900 dark:text-gray-50">
          {translate("WelcomeBack")}
        </Text>

        <TextInput
          className={`${commonStyles.border} border p-4 rounded-lg mb-4 ${commonStyles.text}`}
          placeholder={translate("Email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className={`${commonStyles.border} border p-4 rounded-lg mb-4 ${commonStyles.text}`}
          placeholder={translate("Password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-blue-600 rounded-lg mt-4 p-4"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className={`text-white text-center font-bold text-lg`}>
            {loading ? translate("LoggingIn") : translate("Login")}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400">
            {translate("Or")}
          </Text>
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4 flex-row items-center justify-center"
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Text className="text-gray-900 dark:text-gray-50 text-center font-semibold text-lg">
            {translate("ContinueWithGoogle")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-[#007AFF] text-center mt-4">
            {translate("NoAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
