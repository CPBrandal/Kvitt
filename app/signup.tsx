import { bgColors, commonStyles } from "@/constants/styles";
import { useTranslate } from "@/hooks/useTranslate";
import { signUp } from "@/services/auth";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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
    <View
      className="flex-1 justify-center px-6"
      style={{
        backgroundColor: isDark ? bgColors.swamp : bgColors.porcelain,
      }}
    >
      <View
        className={`${commonStyles.bg} rounded-2xl p-8 border-2 ${commonStyles.border} mb-8`}
      >
        <Text
          className={`font-bold mb-10 text-center text-2xl ${commonStyles.text}`}
        >
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
          className="rounded-lg mt-4 p-4"
          onPress={handleSignUp}
          disabled={loading}
          style={{
            backgroundColor: isDark
              ? commonStyles.secondary
              : commonStyles.primary,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? translate("CreatingAccount") : translate("Signup")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text
            className="text-center mt-4"
            style={{
              color: isDark
                ? commonStyles.imgColorDark
                : commonStyles.imgColorLight,
            }}
          >
            {translate("AlreadyHaveAccount")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
