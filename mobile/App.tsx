import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/state/auth";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TransactionsScreen from "./src/screens/TransactionsScreen";
import InvestmentsScreen from "./src/screens/InvestmentsScreen";
import MortgageScreen from "./src/screens/MortgageScreen";
import BudgetsScreen from "./src/screens/BudgetsScreen";

const Stack = createNativeStackNavigator();

function AuthedApp() {
  const { token, loading } = useAuth();
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#0b1220" },
          headerTintColor: "#e8eefc",
        }}
      >
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
            <Stack.Screen name="Investments" component={InvestmentsScreen} />
            <Stack.Screen name="Mortgage" component={MortgageScreen} />
            <Stack.Screen name="Budgets" component={BudgetsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthedApp />
    </AuthProvider>
  );
}
