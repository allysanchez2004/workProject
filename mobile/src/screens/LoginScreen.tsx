import React, { useState } from "react";
import { TextInput, Text, View } from "react-native";
import { Screen, Card, Button, Label } from "../ui";
import { useAuth } from "../state/auth";
import { colors } from "../theme";

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(fn: "login" | "register") {
    setError(null);
    setBusy(true);
    try {
      if (fn === "login") await login(email, password);
      else await register(email, password);
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen title="mypiggybankmobile">
      <Card>
        <Label>Email</Label>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }}
        />
        <Label>Password</Label>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }}
        />
        {error ? <Text style={{ color: colors.danger, marginBottom: 10 }}>{error}</Text> : null}
        <View style={{ gap: 10 }}>
          <Button label={busy ? "Signing in..." : "Login"} onPress={() => run("login")} disabled={busy} />
          <Button label={busy ? "Creating..." : "Register"} onPress={() => run("register")} disabled={busy} />
        </View>
      </Card>
    </Screen>
  );
}
