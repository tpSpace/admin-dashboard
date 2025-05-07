import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiResponse, Page, Order } from "@/types/orders-schema";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getAllOrders = async (
  page = 0,
  size = 10
): Promise<ApiResponse<Page<Order>>> => {
  const { data } = await api.get<ApiResponse<Page<Order>>>("/v1/orders", {
    params: { page, size },
  });
  return data;
};

export const useGetAllOrders = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["all-orders", page, size],
    queryFn: () => getAllOrders(page, size),
  });

export const changeOrderStatus = async (
  orderId: string,
  status: string
): Promise<ApiResponse<Order>> => {
  const { data } = await api.patch<ApiResponse<Order>>(
    `/v1/orders/${orderId}/status`,
    null,
    { params: { status } }
  );
  return data;
};

export const useChangeOrderStatus = () =>
  useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      changeOrderStatus(orderId, status),
  });
