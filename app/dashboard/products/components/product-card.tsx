import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/types/products-schema";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ProductCard({
  product,
  onDelete,
  onEdit,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const firstRaw = product.images?.[0] ?? "";
  const src = firstRaw
    ? firstRaw.startsWith("data:") || firstRaw.startsWith("http")
      ? firstRaw
      : `data:image/jpeg;base64,${firstRaw}`
    : null;

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-48 bg-muted/30 relative">
        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image
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
