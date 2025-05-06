"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import ProductForm from "./components/product-form";
import ProductCard from "./components/product-card";
import ProductSkeleton from "./components/product-skeleton";
import { useGetProducts, useDeleteProduct } from "@/lib/api/products-api";
import { useGetCategories } from "@/lib/api/categories-api";
import { Category } from "@/types/categories-schema";
import { Product } from "@/types/products-schema";
import EditProductModal from "./components/product-modal";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const queryClient = useQueryClient();

  // Use the custom hooks for fetching and managing products
  const { data: products, isLoading, error } = useGetProducts();
  const { data: categories = [] } = useGetCategories();
  const deleteProductMutation = useDeleteProduct();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Handle product delete
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
          console.error("Error deleting product:", error);
          toast.error("Failed to delete product");
        },
      });
    }
  };

  // Filter products based on search query and category
  // const page = data as Page<Product>;
  const product = products?.content;
  const filteredProducts = product?.filter((product: Product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
  return (
    <div className="container mx-auto p-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {/* Map through fetched categories */}
              {categories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogTitle>Add Product</DialogTitle>
              <ProductForm
                categories={categories} // Pass categories to the form
                onSuccess={() => {
                  setOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["products"] });
                }}
                onCancel={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products grid with loading, empty and error states */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
        </div>
      ) : error ? (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-lg font-medium text-red-500 mb-2">
            Failed to load products
          </p>
          <p className="text-muted-foreground mb-6">
            There was an error loading your products.
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["products"] })
            }
          >
            Retry
          </Button>
        </div>
      ) : filteredProducts?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
              onEdit={() => {
                setProductToEdit(product);
                setEditModalOpen(true);
              }}
            >
              <EditProductModal
                open={editModalOpen}
                setOpen={setEditModalOpen}
                product={product}
                categories={categories}
                onSuccess={() =>
                  queryClient.invalidateQueries({ queryKey: ["products"] })
                }
              />
            </ProductCard>
          ))}
          {productToEdit && (
            <EditProductModal
              product={productToEdit}
              categories={categories}
              open={editModalOpen}
              setOpen={setEditModalOpen}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
              }}
            />
          )}
        </div>
      ) : product?.length ? (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No matching products found</p>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter settings.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-muted-foreground mb-6">
            Add your first product to get started.
          </p>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
}
