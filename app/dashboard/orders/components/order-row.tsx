"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  MoreVertical,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { formatPrice, copyToClipboard, getStatusVariant } from "@/lib/utils";
import { Order, OrderItem } from "@/types/orders-schema";

type Props = {
  order: Order;
  isExpanded: boolean;
  toggleExpand: () => void;
  onStatusChange: (orderId: string, status: string) => void;
};

export function OrderRow({
  order,
  isExpanded,
  toggleExpand,
  onStatusChange,
}: Props) {
  const statusOptions = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const;

  return (
    <>
      <tr className="h-16 cursor-pointer hover:bg-muted/50">
        <td onClick={toggleExpand}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </td>
        <td className="font-mono text-xs">
          <div className="flex items-center">
            <span onClick={toggleExpand}>{order.id.substring(0, 8)}...</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(order.id, "Order ID copied to clipboard");
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </td>
        <td onClick={toggleExpand}>
          {new Date(order.orderDate).toLocaleDateString()}
        </td>
        <td onClick={toggleExpand}>
          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
        </td>
        <td onClick={toggleExpand}>{formatPrice(order.totalAmount)}</td>
        <td className="max-w-xs truncate" onClick={toggleExpand}>
          {order.shippingAddress}
        </td>
        <td className="text-center" onClick={toggleExpand}>
          {order.items.length} items
        </td>
        <td>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange(order.id, status)}
                  disabled={order.status === status}
                  className={order.status === status ? "bg-muted" : ""}
                >
                  Change to {status.toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-muted/30 p-0">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="font-medium">Order Items</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {order.items.map((item: OrderItem) => (
                  <li key={item.id} className="border rounded p-3 shadow-sm">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.productId}
                        </div>
                      </div>
                      <Badge variant="outline">Qty: {item.quantity}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.price)} each
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
