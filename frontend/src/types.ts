export type Role = "ADMIN" | "MANAGER";
export type LeadStatus = "NEW" | "IN_PROGRESS" | "CLOSED";
export type DealStage = "NEW" | "IN_PROGRESS" | "CLOSED";
export type PlanType = "BASIC" | "PRO" | "BUSINESS";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Client {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
  createdAt: string;
  _count?: { leads: number; deals: number };
}

export interface Lead {
  id: string;
  status: LeadStatus;
  date: string;
  source?: string | null;
  clientId?: string | null;
  client?: Client | null;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  stage: DealStage;
  amount?: number | null;
  clientId?: string | null;
  client?: Client | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  entityType: string;
  action: string;
  message: string;
  createdAt: string;
  user: { name: string; role: Role };
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface DashboardOverview {
  totalLeads: number;
  totalDeals: number;
  closedDeals: number;
  conversionRate: number;
  leadsByStatus: Record<LeadStatus, number>;
  leadsSeries: { date: string; leads: number }[];
  recentActivities: Activity[];
}

export interface OnboardingStep2 {
  id: string;
  plan: PlanType;
  teamSize: number;
  telegramEnabled: boolean;
  employeeLoadEnabled: boolean;
  onlinePayments: boolean;
  completed: boolean;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
  timezone: string;
  currency: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  taxId?: string | null;
}
