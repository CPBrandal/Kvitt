import { commonStyles } from "@/constants/styles";
import { translate } from "@/constants/textMappings";
import { signIn } from "@/services/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <View className="flex-1 bg-gray-50 dark:bg-gray-950 justify-center">
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 mb-8 justifyContent-center">
        <Text className="font-bold mb-10 text-center text-2xl text-gray-900 dark:text-gray-50">
          {translate("WelcomeBack")}
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg mb-4 text-gray-900 dark:text-gray-50"
          placeholder={translate("Email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg mb-4 text-base text-gray-900 dark:text-gray-50"
          placeholder={translate("Password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-lg mt-4 text-center p-4"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="font-bold text-lg text-white">
            {loading ? translate("LoggingIn") : translate("Login")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className={`${commonStyles.text} text-center mt-20`}>
            {translate("NoAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
