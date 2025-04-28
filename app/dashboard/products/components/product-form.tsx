"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { X } from "lucide-react";
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
import {
  productSchema,
  ProductFormValues,
  Product,
} from "@/types/products-schema";
import { useCreateProduct, useUpdateProduct } from "@/lib/api/products-api";
import { Category } from "@/types/categories-schema";

interface ProductFormProps {
  initialData?: Product;
  categories?: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  initialData,
  onSuccess,
  onCancel,
  categories = [],
}: ProductFormProps) {
  const isEditing = Boolean(initialData);
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  // For new uploads
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // For existing images (when editing)
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images || []
  );

  // Initialize form with default or existing values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category || "",
      quantity: initialData?.quantity || 0,
      images: [],
    },
  });

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
    };
  }, [previewImages]);

  // Form submission handler
  const onSubmit = (data: ProductFormValues) => {
    if (isEditing && initialData) {
      // Update existing product
      updateProductMutation.mutate(
        {
          id: initialData.id,
          data: {
            ...data,
            // Include any changes to existing images if needed
            // existingImages: existingImages
          },
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        }
      );
    } else {
      // Create new product
      createProductMutation.mutate(data, {
        onSuccess: () => {
          form.reset();
          previewImages.forEach(URL.revokeObjectURL);
          setPreviewImages([]);
          onSuccess();
        },
      });
    }
  };

  // Handle file drop for new images
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const maxImages = 10;
      const currentImages = form.getValues("images") || [];

      // Limit to max 10 images
      const newFiles = acceptedFiles.slice(0, maxImages - currentImages.length);

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

  // Remove a new image preview
  const removeNewImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages, { shouldValidate: true });

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Remove an existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    // In a real app, you'd also track removed images to delete them on the server
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Product information fields */}
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        {/* Existing images section (when editing) */}
        {isEditing && existingImages.length > 0 && (
          <>
            <div className="space-y-2">
              <FormLabel>Existing Images</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((src, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                      <Image
                        src={
                          src.startsWith("http") || src.startsWith("data:")
                            ? src
                            : `data:image/jpeg;base64,${src}`
                        }
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeExistingImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full p-0.5 shadow-md text-white bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* New images upload */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <ImageUpload
              previewImages={previewImages}
              onDrop={onDrop}
              handleFileChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onDrop(Array.from(e.target.files));
                }
              }}
              removeImage={removeNewImage}
            />
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createProductMutation.isPending || updateProductMutation.isPending
            }
          >
            {isEditing
              ? updateProductMutation.isPending
                ? "Saving..."
                : "Save Changes"
              : createProductMutation.isPending
              ? "Adding..."
              : "Add Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
