"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { OrderRow } from "./order-row";
import { Order } from "@/types/orders-schema";

type Props = {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
};

export function OrdersTable({ orders, onStatusChange }: Props) {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="h-16">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[120px]">Order ID</TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px]">Total</TableHead>
            <TableHead>Shipping Address</TableHead>
            <TableHead className="w-[80px]">Items</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow className="h-16">
              <TableCell colSpan={8} className="text-center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                isExpanded={!!expandedOrders[order.id]}
                toggleExpand={() => toggleExpand(order.id)}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
