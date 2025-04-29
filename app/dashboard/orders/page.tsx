"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetAllOrders, useChangeOrderStatus } from "@/lib/api/orders-api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const { data, isLoading, error } = useGetAllOrders(page, pageSize);
  const changeStatusMutation = useChangeOrderStatus();

  // Extract data from the nested API response structure
  const ordersPage = data?.data;
  const orders = ordersPage?.content || [];
  const totalPages = ordersPage?.totalPages || 0;

  // Available order status options
  const statusOptions = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  // Status badge variant mapper
  const getStatusVariant = (status: string) => {
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
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle status change
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

  // Toggle expanded state for an order
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
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
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Failed to load orders
              </h2>
              <p className="text-muted-foreground mb-4">
                There was a problem loading your order data. Please try again.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
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

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead> {/* Expand column */}
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Total</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead className="w-[80px]">Items</TableHead>
              <TableHead className="w-[60px]"></TableHead>
              {/* Actions column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <>
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell onClick={() => toggleOrderExpand(order.id)}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {expandedOrders[order.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell
                      className="font-mono text-xs"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      {order.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell onClick={() => toggleOrderExpand(order.id)}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={() => toggleOrderExpand(order.id)}>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => toggleOrderExpand(order.id)}>
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell
                      className="max-w-xs truncate"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      {order.shippingAddress}
                    </TableCell>
                    <TableCell
                      className="text-center"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="text-sm">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={changeStatusMutation.isPending}
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {statusOptions.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() =>
                                handleStatusChange(order.id, status)
                              }
                              disabled={order.status === status}
                              className={
                                order.status === status ? "bg-muted" : ""
                              }
                            >
                              Change to {status.toLowerCase()}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded order items row */}
                  {expandedOrders[order.id] && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30 p-0">
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                            <ShoppingBag className="h-4 w-4" />
                            <span>Order Items</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="bg-card border rounded-md p-3 shadow-sm"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">
                                      {item.productName}
                                    </h4>
                                    <div className="text-sm text-muted-foreground">
                                      ID: {item.productId.substring(0, 8)}...
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="ml-2">
                                    Qty: {item.quantity}
                                  </Badge>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Unit Price: {formatCurrency(item.price)}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // Show pages around current page
              let pageNum = page;
              if (page < 2) {
                pageNum = i;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }

              // Make sure we're in bounds
              if (pageNum < 0) pageNum = 0;
              if (pageNum >= totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
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
    </div>
  );
}
