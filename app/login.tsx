import { translate } from "@/constants/textMappings";
import { signIn } from "@/services/auth";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      router.replace("/");
    } else {
      Alert.alert("Login Failed", result.error);
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
          className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg mb-4 text-base"
          placeholder={translate("Password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : translate("Login")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>{translate("NoAccount")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
  },
});
