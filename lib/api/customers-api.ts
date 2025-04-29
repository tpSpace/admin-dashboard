import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Page } from "@/types/page";

// Customer type definition
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    role: string;
    description: string;
    id: string;
  };
  createdAt: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Fetch a page of customers */
export const getCustomers = async (
  page = 0,
  size = 10
): Promise<Page<Customer>> => {
  const { data } = await api.get<Page<Customer>>("/v1/users", {
    params: { page, size },
  });
  console.log("Customers API response:", data);
  return data;
};

/** Change a customer's role */
export const changeCustomerRole = async (
  customerId: string,
  role: string
): Promise<Customer> => {
  const { data } = await api.patch(`/v1/users/${customerId}/role`, null, {
    params: {
      id: customerId, // Include as query param since @RequestParam expects it
      role: role, // Include as query param
    },
  });
  return data;
};

/** React‑Query hook for fetching customers */
export const useGetCustomers = (page = 0, size = 10) =>
  useQuery({
    queryKey: ["customers", page, size],
    queryFn: () => getCustomers(page, size),
  });

/** React-Query hook for changing customer role */
export const useChangeCustomerRole = () =>
  useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      changeCustomerRole(id, role),
  });
