"use client";

import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  useGetProducts,
  useDeleteProduct,
  useGetBatchProductImages,
} from "@/lib/api/products-api";
import { useGetCategories } from "@/lib/api/categories-api";
import { Category } from "@/types/categories-schema";
import { Product } from "@/types/products-schema";
import EditProductModal from "./components/product-modal";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(12); // Number of products per page
  const queryClient = useQueryClient();

  // Use the custom hooks for fetching and managing products with pagination
  const { data: products, isLoading, error } = useGetProducts(page, pageSize);
  const { data: categories = [] } = useGetCategories();
  const deleteProductMutation = useDeleteProduct();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Get paginated data
  const product = products?.content || [];
  const totalPages = products?.totalPages || 0;
  const totalElements = products?.totalElements || 0;

  // Get all product IDs for the current page
  const productIds = product.map((p) => p.id);

  // Fetch all images for current page products at once
  const { data: productImages, isLoading: loadingImages } =
    useGetBatchProductImages(productIds);

  // Handle product delete
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.invalidateQueries({ queryKey: ["product-images-batch"] });
        },
        onError: (error) => {
          console.error("Error deleting product:", error);
          toast.error("Failed to delete product");
        },
      });
    }
  };

  // Option 1: Client-side filtering (if you want to keep filtering in the UI)
  const filteredProducts = product?.filter((product: Product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Reset to first page when filters change
  const handleFilterChange = (search: string, category: string) => {
    setSearchQuery(search);
    setCategoryFilter(category);
    setPage(0); // Reset to first page when filters change
  };

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
              onChange={(e) =>
                handleFilterChange(e.target.value, categoryFilter)
              }
            />
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) => handleFilterChange(searchQuery, value)}
          >
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
                  queryClient.invalidateQueries({
                    queryKey: ["product-images-batch"],
                  });
                  toast.success("Product added successfully");
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
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["products"] });
              queryClient.invalidateQueries({
                queryKey: ["product-images-batch"],
              });
            }}
          >
            Retry
          </Button>
        </div>
      ) : filteredProducts?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                preloadedImages={productImages?.[product.id]}
                imagesLoading={loadingImages}
                onDelete={handleDeleteProduct}
                onEdit={() => {
                  setProductToEdit(product);
                  setEditModalOpen(true);
                }}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center text-sm mx-4">
                <span className="text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <span className="mx-2">·</span>
                <span className="text-muted-foreground">
                  {totalElements} products
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : product?.length ? (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No matching products found</p>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter settings.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              handleFilterChange("", "");
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

      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          categories={categories}
          open={editModalOpen}
          setOpen={setEditModalOpen}
          onSuccess={() => {
            setEditModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({
              queryKey: ["product-images-batch"],
            });
            toast.success("Product updated successfully");
          }}
        />
      )}
    </div>
  );
}
