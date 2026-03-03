import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList } from "react-native";
import { Screen, Card, Button, Label } from "../ui";
import { api } from "../api";
import { colors } from "../theme";

export default function TransactionsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [description, setDescription] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    try {
      setItems(await api.listTransactions());
    } catch (e: any) {
      setErr(e?.message || "Failed");
    }
  }

  async function add() {
    setErr(null);
    try {
      const amt = Number(amount);
      if (Number.isNaN(amt) || amt === 0) throw new Error("Amount must be non-zero (positive=income, negative=expense)");
      await api.addTransaction(amt, category, description);
      setAmount(""); setDescription("");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed");
    }
  }

  async function del(id: number) {
    setErr(null);
    try {
      await api.deleteTransaction(id);
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed");
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <Screen title="Transactions">
      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Add transaction</Text>
        <Label>Amount (+income / -expense)</Label>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Category</Label>
        <TextInput value={category} onChangeText={setCategory}
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Description</Label>
        <TextInput value={description} onChangeText={setDescription}
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        {err ? <Text style={{ color: colors.danger, marginBottom: 10 }}>{err}</Text> : null}
        <Button label="Add" onPress={add} />
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Recent</Text>
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#223055" }}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>
                {item.amount >= 0 ? "+" : "-"}${Math.abs(item.amount).toFixed(2)} • {item.category}
              </Text>
              <Text style={{ color: colors.muted }}>
                {item.description || "(no description)"} • {new Date(item.timestamp).toLocaleString()}
              </Text>
              <View style={{ marginTop: 6, width: 110 }}>
                <Button label="Delete" variant="danger" onPress={() => del(item.id)} />
              </View>
            </View>
          )}
        />
        <View style={{ marginTop: 10 }}>
          <Button label="Refresh" onPress={refresh} />
        </View>
      </Card>
    </Screen>
  );
}
