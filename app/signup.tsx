import { commonStyles } from "@/constants/styles";
import { useTranslate } from "@/hooks/useTranslate";
import { signUp } from "@/services/auth";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", translate("PleaseFillAllFields"));
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", translate("PasswordLengthRequirement"));
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        translate("CheckYourEmail"),
        translate("VerificationEmailSent"),
        [
          {
            text: "OK",
            onPress: () => router.replace("/verify-email"),
          },
        ]
      );
    } else {
      Alert.alert(translate("SignupFailed"), result.error);
    }
  };

  return (
    <View className={`${commonStyles.bgScreen} flex-1 justify-center`}>
      <View className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800 mb-8 justifyContent-center">
        <Text className="font-bold mb-10 text-center text-2xl text-gray-900 dark:text-gray-50">
          {translate("CreateAccount")}
        </Text>
        <TextInput
          className={`${commonStyles.border} border p-4 rounded-lg mb-4 ${commonStyles.text}`}
          placeholder={translate("FullName")}
          value={name}
          onChangeText={setName}
        />
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
          placeholder={translate("PasswordLength")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-blue-600 rounded-lg mt-4 p-4"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className={`text-white text-center font-bold text-lg`}>
            {loading ? translate("CreatingAccount") : translate("Signup")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text className="text-[#007AFF] text-center mt-4">
            {translate("AlreadyHaveAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
