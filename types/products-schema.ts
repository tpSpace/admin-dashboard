import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(20, { message: "Name must be at most 20 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(200, { message: "Description must be at most 200 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Please select a category" }),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Quantity must be a non-negative integer" }),
  images: z
    .array(z.instanceof(File))
    .max(10, { message: "Cannot upload more than 10 images" })
    .optional(),
});

// Product type definition
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  images?: string[]; // base64 encoded images or URLs
  // images array is removed from here
};
export type ProductImage = {
  id: string;
  productId: string;
  imageData: string; // base64 encoded image or URL
};
export type ProductFormValues = z.infer<typeof productSchema>;
