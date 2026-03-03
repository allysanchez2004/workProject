import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList } from "react-native";
import { Screen, Card, Button, Label } from "../ui";
import { api } from "../api";
import { colors } from "../theme";

export default function InvestmentsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [ticker, setTicker] = useState<string>("AAPL");
  const [shares, setShares] = useState<string>("1");
  const [avgCost, setAvgCost] = useState<string>("100");
  const [notes, setNotes] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    try { setItems(await api.listInvestments()); }
    catch (e: any) { setErr(e?.message || "Failed"); }
  }

  async function save() {
    setErr(null);
    try {
      await api.upsertInvestment(ticker, Number(shares), Number(avgCost), notes);
      await refresh();
    } catch (e: any) { setErr(e?.message || "Failed"); }
  }

  async function del(id: number) {
    setErr(null);
    try { await api.deleteInvestment(id); await refresh(); }
    catch (e: any) { setErr(e?.message || "Failed"); }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <Screen title="Investments">
      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Add / Update holding</Text>
        <Label>Ticker</Label>
        <TextInput value={ticker} onChangeText={setTicker} autoCapitalize="characters"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Shares</Label>
        <TextInput value={shares} onChangeText={setShares} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Avg cost</Label>
        <TextInput value={avgCost} onChangeText={setAvgCost} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Notes</Label>
        <TextInput value={notes} onChangeText={setNotes}
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        {err ? <Text style={{ color: colors.danger, marginBottom: 10 }}>{err}</Text> : null}
        <Button label="Save" onPress={save} />
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Holdings</Text>
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#223055" }}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{item.ticker} • {item.shares} shares</Text>
              <Text style={{ color: colors.muted }}>Avg cost: ${Number(item.avg_cost).toFixed(2)}</Text>
              {item.notes ? <Text style={{ color: colors.muted }}>{item.notes}</Text> : null}
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
