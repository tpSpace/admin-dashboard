import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Page, Order, ApiResponse } from "@/types/orders-schema";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Admin-only: Fetch all orders (requires ADMIN role) */
export const getAllOrders = async (
  page = 0,
  size = 10
): Promise<ApiResponse<Page<Order>>> => {
  const { data } = await api.get<ApiResponse<Page<Order>>>("/v1/orders", {
    params: { page, size },
  });
  return data;
};

/** React‑Query hook for admin dashboard */
export const useGetAllOrders = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["all-orders", page, size],
    queryFn: () => getAllOrders(page, size),
  });
