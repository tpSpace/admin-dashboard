import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string, message: string) {
  navigator.clipboard.writeText(text).then(
    () => toast.success(message),
    () => toast.error("Failed to copy to clipboard")
  );
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getStatusVariant(status: string) {
  const statusMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "outline",
    PROCESSING: "secondary",
    SHIPPED: "default",
    DELIVERED: "default",
    CANCELLED: "destructive",
  };
  return statusMap[status] || "outline";
}

export const formatBase64Image = (
  imageUrl: string,
  mimeType?: string
): string => {
  console.log("formatBase64Image", imageUrl);
  if (imageUrl === "") {
    return "";
  }
  const mime = mimeType || "image/jpeg"; // Fallback to JPEG
  return `data:${mime};base64,${imageUrl}`;
};
