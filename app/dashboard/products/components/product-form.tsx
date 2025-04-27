"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "./image-upload";
import { productSchema, ProductFormValues } from "@/types/products-schema";
import { useCreateProduct } from "@/lib/api/products-api";
import { toast } from "sonner";
import { Category } from "@/types/categories-schema";

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  categories?: Category[];
}

export default function ProductForm({
  onSuccess,
  onCancel,
  categories = [],
}: ProductFormProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const createProductMutation = useCreateProduct();

  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: [],
    },
  });

  // Form submission handler
  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages([]);
        onSuccess();
      },
    });
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const maxImages = 10; // Max 10 images
      const currentImages = form.getValues("images") || [];

      // Check if adding these files would exceed the limit
      if (currentImages.length + acceptedFiles.length > maxImages) {
        toast.error(
          `Cannot upload more than ${maxImages} images. You already have ${currentImages.length}.`
        );
      }

      const newFiles = acceptedFiles
        .filter(
          (file) => file.type.startsWith("image/") && file.size <= maxSize
        )
        .slice(0, maxImages - currentImages.length);

      if (newFiles.length < acceptedFiles.length) {
        toast.error(
          "Some files were rejected (invalid type, size > 5MB, or max 10 images)"
        );
      }

      if (newFiles.length > 0) {
        form.setValue("images", [...currentImages, ...newFiles], {
          shouldValidate: true,
        });

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
      }
    },
    [form]
  );

  // Remove an image
  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages, { shouldValidate: true });

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onDrop(filesArray);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new product to your inventory.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the product"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={() => (
              <ImageUpload
                previewImages={previewImages}
                onDrop={onDrop}
                handleFileChange={handleFileChange}
                removeImage={removeImage}
              />
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                previewImages.forEach((url) => URL.revokeObjectURL(url));
                setPreviewImages([]);
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
