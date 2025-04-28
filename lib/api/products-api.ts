import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/auth-store";
import { Product, ProductFormValues } from "@/types/products-schema";
import { Page } from "@/types/page";

// Create API instance with auth token
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api",
  withCredentials: true,
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to add a new product
export const createProduct = async (data: ProductFormValues) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("quantity", data.quantity.toString());
  formData.append("category", data.category);

  if (data.images && data.images.length > 0) {
    data.images.forEach((image: File) => {
      formData.append("images", image);
    });
  }

  const response = await api.post("/v1/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Function to fetch products
// filepath: src/api/products.ts (update getProducts)

export const getProducts = async (
  page = 0,
  size = 10
): Promise<Page<Product>> => {
  const { data: rawPage } = await api.get<Page<Product>>("/v1/products", {
    params: { page, size },
  });
  console.log("Products API response:", rawPage);
  return {
    ...rawPage,
    content: rawPage.content,
  };
};

// Function to fetch a single product
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/v1/products/${id}`);
  return response.data;
};

// Function to update a product
export const updateProduct = async (
  id: string,
  data: ProductFormValues
): Promise<Product> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("category", data.category);
  formData.append("quantity", data.quantity.toString());

  if (data.images && data.images.length > 0) {
    data.images.forEach((image: File) => {
      formData.append("images", image);
    });
  }

  const response = await api.put(`/v1/products?id=${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Function to delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/v1/products?id=${id}`);
};

// React Query hooks
export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product added successfully");
    },
    onError: (error) => {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormValues }) =>
      updateProduct(id, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: deleteProduct,
  });
};
