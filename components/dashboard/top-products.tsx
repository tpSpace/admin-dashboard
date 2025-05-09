"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductPerformance } from "@/types/dashboard";

interface TopProductsProps {
  products?: ProductPerformance[];
}

const defaultProducts: ProductPerformance[] = [
  {
    product: {
      id: "1",
      name: "Product A",
      description: "Description for Product A",
      price: 99.99,
      category: "Electronics",
      quantity: 50,
      images: []
    },
    totalSales: 1500,
    revenue: 14998.50,
    unitsSold: 150
  },
  {
    product: {
      id: "2",
      name: "Product B",
      description: "Description for Product B",
      price: 49.99,
      category: "Clothing",
      quantity: 100,
      images: []
    },
    totalSales: 1200,
    revenue: 5998.80,
    unitsSold: 120
  },
  {
    product: {
      id: "3",
      name: "Product C",
      description: "Description for Product C",
      price: 29.99,
      category: "Home",
      quantity: 200,
      images: []
    },
    totalSales: 800,
    revenue: 2399.20,
    unitsSold: 80
  }
];

export function TopProducts({ products = defaultProducts }: TopProductsProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No product data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((item, index) => (
            <div key={item.product.id} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <span className="w-6 text-center text-muted-foreground">{index + 1}</span>
                <span className="ml-2 font-medium">{item.product.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">({item.product.category})</span>
              </div>
              <div className="text-right">
                <div className="font-medium">${item.revenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{item.unitsSold} units</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 