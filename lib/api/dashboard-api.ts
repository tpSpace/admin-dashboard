import axios from "axios";
import { DashboardApiResponse, DashboardData } from "@/types/dashboard";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardApiResponse>("/dashboard");
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const fetchSalesTrend = async (
  period: "daily" | "weekly" | "monthly",
  startDate?: string,
  endDate?: string
): Promise<any> => {
  const queryParams: Record<string, string> = { period };
  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;

  const response = await apiClient.get("/dashboard/sales/trend", {
    params: queryParams,
  });
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const fetchTopProducts = async (
  limit: number = 5,
  period?: string
): Promise<any> => {
  const queryParams: Record<string, string | number> = { limit };
  if (period) queryParams.period = period;

  const response = await apiClient.get("/dashboard/sales/top-products", {
    params: queryParams,
  });
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
