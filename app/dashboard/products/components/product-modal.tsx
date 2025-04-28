"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Product } from "@/types/products-schema";
import type { Category } from "@/types/categories-schema";
import ProductForm from "./product-form";

interface EditProductModalProps {
  product: Product;
  categories: Category[];
  onSuccess: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}
// product-modal.tsx
export default function EditProductModal({
  product,
  categories,
  onSuccess,
  open,
  setOpen,
}: EditProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Remove the DialogTrigger since we control from outside */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update details and manage images for <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          initialData={product}
          categories={categories}
          onSuccess={() => {
            setOpen(false);
            onSuccess();
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
