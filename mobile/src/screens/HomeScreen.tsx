import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Screen, Card, Button, Stat } from "../ui";
import { api } from "../api";
import { useAuth } from "../state/auth";
import { colors } from "../theme";

export default function HomeScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    try {
      setData(await api.dashboard());
    } catch (e: any) {
      setErr(e?.message || "Failed");
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <Screen title="Dashboard">
      <Card>
        {err ? <Text style={{ color: colors.danger }}>{err}</Text> : null}
        {data ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Stat label="Balance (est.)" value={`$${data.balance_estimate.toFixed(2)}`} />
            <Stat label="Income (month)" value={`$${data.month_income.toFixed(2)}`} />
            <Stat label="Expenses (month)" value={`$${data.month_expenses.toFixed(2)}`} />
            <Stat label="Net (month)" value={`$${data.net_this_month.toFixed(2)}`} />
          </View>
        ) : <Text style={{ color: colors.muted }}>Loading...</Text>}
        <View style={{ marginTop: 10 }}>
          <Button label="Refresh" onPress={refresh} />
        </View>
      </Card>

      <Card>
        <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 10 }}>Modules</Text>
        <View style={{ gap: 10 }}>
          <Button label="Transactions" onPress={() => navigation.navigate("Transactions")} />
          <Button label="Investments" onPress={() => navigation.navigate("Investments")} />
          <Button label="Mortgage" onPress={() => navigation.navigate("Mortgage")} />
          <Button label="Budgets" onPress={() => navigation.navigate("Budgets")} />
          <Button label="Logout" variant="danger" onPress={logout} />
        </View>
      </Card>
    </Screen>
  );
}
