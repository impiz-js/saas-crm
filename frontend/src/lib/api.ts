import { Client, Deal, Lead, PaginatedResponse, DashboardOverview, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    let payload: any = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    throw new ApiError(payload?.message || "Ошибка запроса", res.status, payload?.details);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

export const api = {
  async login(email: string, password: string) {
    return request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  },
  async register(name: string, email: string, password: string) {
    return request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });
  },
  async me(token: string) {
    return request<{ user: User }>("/auth/me", { method: "GET" }, token);
  },
  async getDashboard(token: string) {
    return request<DashboardOverview>("/dashboard/overview", { method: "GET" }, token);
  },
  async listClients(token: string, params: Record<string, string | number | undefined>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    return request<PaginatedResponse<Client>>(`/clients?${query.toString()}`, { method: "GET" }, token);
  },
  async createClient(token: string, data: Partial<Client>) {
    return request<Client>("/clients", { method: "POST", body: JSON.stringify(data) }, token);
  },
  async updateClient(token: string, id: string, data: Partial<Client>) {
    return request<Client>(`/clients/${id}`, { method: "PATCH", body: JSON.stringify(data) }, token);
  },
  async deleteClient(token: string, id: string) {
    return request<void>(`/clients/${id}`, { method: "DELETE" }, token);
  },
  async listLeads(token: string, params: Record<string, string | number | undefined>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    return request<PaginatedResponse<Lead>>(`/leads?${query.toString()}`, { method: "GET" }, token);
  },
  async createLead(token: string, data: Partial<Lead>) {
    return request<Lead>("/leads", { method: "POST", body: JSON.stringify(data) }, token);
  },
  async updateLead(token: string, id: string, data: Partial<Lead>) {
    return request<Lead>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(data) }, token);
  },
  async deleteLead(token: string, id: string) {
    return request<void>(`/leads/${id}`, { method: "DELETE" }, token);
  },
  async listDeals(token: string, params: Record<string, string | number | undefined>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    return request<PaginatedResponse<Deal>>(`/deals?${query.toString()}`, { method: "GET" }, token);
  },
  async createDeal(token: string, data: Partial<Deal>) {
    return request<Deal>("/deals", { method: "POST", body: JSON.stringify(data) }, token);
  },
  async updateDeal(token: string, id: string, data: Partial<Deal>) {
    return request<Deal>(`/deals/${id}`, { method: "PATCH", body: JSON.stringify(data) }, token);
  },
  async deleteDeal(token: string, id: string) {
    return request<void>(`/deals/${id}`, { method: "DELETE" }, token);
  }
};

export { ApiError };
