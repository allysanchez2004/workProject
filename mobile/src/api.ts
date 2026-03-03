import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem("auth_token");
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem("auth_token", token);
  else await AsyncStorage.removeItem("auth_token");
}

async function request(path: string, method: HttpMethod, body?: any) {
  const token = await getToken();
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export const api = {
  async register(email: string, password: string) {
    return request("/auth/register", "POST", { email, password });
  },
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async dashboard() { return request("/dashboard", "GET"); },

  async listTransactions() { return request("/transactions", "GET"); },
  async addTransaction(amount: number, category: string, description: string) {
    return request("/transactions", "POST", { amount, category, description });
  },
  async deleteTransaction(id: number) { return request(`/transactions/${id}`, "DELETE"); },

  async listInvestments() { return request("/investments", "GET"); },
  async upsertInvestment(ticker: string, shares: number, avg_cost: number, notes: string) {
    return request("/investments", "POST", { ticker, shares, avg_cost, notes });
  },
  async deleteInvestment(id: number) { return request(`/investments/${id}`, "DELETE"); },

  async getMortgage() { return request("/mortgage", "GET"); },
  async upsertMortgage(principal: number, annual_rate: number, term_months: number, extra_payment: number) {
    return request("/mortgage", "POST", { principal, annual_rate, term_months, extra_payment });
  },
  async mortgageSummary() { return request("/mortgage/summary", "GET"); },

  async listBudgets() { return request("/budgets", "GET"); },
  async upsertBudget(category: string, monthly_limit: number, active: boolean) {
    return request("/budgets", "POST", { category, monthly_limit, active });
  },
  async deleteBudget(id: number) { return request(`/budgets/${id}`, "DELETE"); },
};
