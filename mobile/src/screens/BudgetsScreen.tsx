import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList } from "react-native";
import { Screen, Card, Button, Label } from "../ui";
import { api } from "../api";
import { colors } from "../theme";

export default function BudgetsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("groceries");
  const [limit, setLimit] = useState<string>("400");
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    try { setItems(await api.listBudgets()); }
    catch (e: any) { setErr(e?.message || "Failed"); }
  }

  async function save() {
    setErr(null);
    try {
      await api.upsertBudget(category, Number(limit), true);
      await refresh();
    } catch (e: any) { setErr(e?.message || "Failed"); }
  }

  async function del(id: number) {
    setErr(null);
    try { await api.deleteBudget(id); await refresh(); }
    catch (e: any) { setErr(e?.message || "Failed"); }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <Screen title="Budgets">
      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Add / Update budget</Text>
        <Label>Category</Label>
        <TextInput value={category} onChangeText={setCategory} autoCapitalize="none"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Monthly limit</Label>
        <TextInput value={limit} onChangeText={setLimit} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        {err ? <Text style={{ color: colors.danger, marginBottom: 10 }}>{err}</Text> : null}
        <Button label="Save" onPress={save} />
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Budgets</Text>
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#223055" }}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{item.category}</Text>
              <Text style={{ color: colors.muted }}>${Number(item.monthly_limit).toFixed(2)} • {item.active ? "active" : "inactive"}</Text>
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
