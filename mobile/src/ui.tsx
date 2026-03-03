import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "./theme";

export function Screen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "700", marginBottom: 12 }}>{title}</Text>
      {children}
    </View>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 12 }}>{children}</View>;
}

export function Button({ label, onPress, variant="primary", disabled=false }: {
  label: string; onPress: () => void; variant?: "primary" | "danger"; disabled?: boolean;
}) {
  const bg = variant === "danger" ? colors.danger : colors.accent;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#2a3450" : bg,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.muted, marginBottom: 6 }}>{children}</Text>;
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 10, marginRight: 12 }}>
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

export function Loading() {
  return <ActivityIndicator />;
}
