import React, { useEffect, useState } from "react";
import { Text, View, TextInput } from "react-native";
import { Screen, Card, Button, Label, Stat } from "../ui";
import { api } from "../api";
import { colors } from "../theme";

export default function MortgageScreen() {
  const [principal, setPrincipal] = useState<string>("300000");
  const [rate, setRate] = useState<string>("6.5");
  const [term, setTerm] = useState<string>("360");
  const [extra, setExtra] = useState<string>("0");
  const [summary, setSummary] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const m = await api.getMortgage();
      if (m) {
        setPrincipal(String(m.principal));
        setRate(String(m.annual_rate));
        setTerm(String(m.term_months));
        setExtra(String(m.extra_payment));
      }
      setSummary(await api.mortgageSummary());
    } catch (e: any) {
      setErr(e?.message || "Failed");
    }
  }

  async function save() {
    setErr(null);
    try {
      await api.upsertMortgage(Number(principal), Number(rate), Number(term), Number(extra));
      setSummary(await api.mortgageSummary());
    } catch (e: any) {
      setErr(e?.message || "Failed");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Screen title="Mortgage">
      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Mortgage inputs</Text>
        <Label>Principal</Label>
        <TextInput value={principal} onChangeText={setPrincipal} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Annual rate (%)</Label>
        <TextInput value={rate} onChangeText={setRate} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Term (months)</Label>
        <TextInput value={term} onChangeText={setTerm} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        <Label>Extra payment (monthly)</Label>
        <TextInput value={extra} onChangeText={setExtra} keyboardType="numeric"
          style={{ backgroundColor: "#0e1730", color: colors.text, padding: 12, borderRadius: 10, marginBottom: 10 }} />
        {err ? <Text style={{ color: colors.danger, marginBottom: 10 }}>{err}</Text> : null}
        <Button label="Save & Recompute" onPress={save} />
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Summary</Text>
        {summary ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Stat label="Monthly payment (incl extra)" value={`$${Number(summary.monthly_payment).toFixed(2)}`} />
            <Stat label="Months to payoff" value={`${summary.months_to_payoff ?? "N/A"}`} />
            <Stat label="Total interest" value={summary.total_interest == null ? "N/A" : `$${Number(summary.total_interest).toFixed(2)}`} />
          </View>
        ) : <Text style={{ color: colors.muted }}>Loading...</Text>}
        <View style={{ marginTop: 10 }}>
          <Button label="Refresh" onPress={load} />
        </View>
      </Card>
    </Screen>
  );
}
