import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Page, Order } from "@/types/orders-schema";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Fetch a page of orders for current user/customer */
export const getOrders = async (page = 0, size = 10): Promise<Page<Order>> => {
  const { data } = await api.get<Page<Order>>("/v1/orders", {
    params: { page, size },
  });
  return data;
};

/** React‑Query hook */
export const useGetOrders = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["orders", page, size],
    queryFn: () => getOrders(page, size),
  });
