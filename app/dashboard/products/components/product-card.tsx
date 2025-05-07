import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ImageIcon } from "lucide-react";
import { Product, ProductImage } from "@/types/products-schema";
import { formatBase64Image, formatPrice } from "@/lib/utils";
import { useGetProductImages } from "@/lib/api/products-api";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardProps {
  product: Product;
  preloadedImages?: ProductImage[]; // Add this prop
  imagesLoading?: boolean; // Add this prop
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  children?: React.ReactNode;
}

export default function ProductCard({
  product,
  preloadedImages,
  imagesLoading = false,
  onDelete,
  onEdit,
}: ProductCardProps) {
  // Fetch images separately using the dedicated hook
  const { data: images, isLoading: loadingIndividualImages } =
    useGetProductImages(product.id);

  // Use preloaded images if available, otherwise use fetched images
  const productImages = preloadedImages || images;
  const loadingImages = !preloadedImages
    ? loadingIndividualImages
    : imagesLoading;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // When images load, set the first one as our display image
  useEffect(() => {
    if (productImages && productImages.length > 0) {
      setImageUrl(formatBase64Image(productImages[0].imageData));
    }
  }, [productImages]);

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-48 bg-muted/30 relative">
        {loadingImages ? (
          <div className="h-full w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <ImageIcon className="h-8 w-8 mr-2" />
            <span>No image</span>
          </div>
        )}
        <Badge className="absolute top-2 right-2">{product.category}</Badge>
      </div>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium truncate">{product.name}</h3>
          <p className="text-primary font-semibold">
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 text-sm">
          <span
            className={product.quantity > 0 ? "text-green-600" : "text-red-500"}
          >
            {product.quantity > 0
              ? `${product.quantity} in stock`
              : "Out of stock"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(product.id)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
