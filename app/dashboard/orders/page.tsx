"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetAllOrders, useChangeOrderStatus } from "@/lib/api/orders-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { OrdersTable } from "./components/order-table";

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetAllOrders(page, pageSize);
  const changeStatusMutation = useChangeOrderStatus();

  const ordersPage = data?.data;
  const orders = ordersPage?.content || [];
  const totalPages = ordersPage?.totalPages || 0;

  const handleStatusChange = (orderId: string, newStatus: string) => {
    changeStatusMutation.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Order status changed to ${newStatus}`);
          queryClient.invalidateQueries({ queryKey: ["all-orders"] });
        },
        onError: () => {
          toast.error("Failed to change order status");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Orders</h1>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Orders</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Failed to load orders
            </h2>
            <p className="text-muted-foreground mb-4">
              There was a problem loading your order data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="text-sm text-muted-foreground">
          Showing {orders.length} of {ordersPage?.totalElements || 0} orders
        </div>
      </div>

      <OrdersTable orders={orders} onStatusChange={handleStatusChange} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
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
    </div>
  );
}
