/** Single order line item */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

/** A pageable order record */
export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  status: string;
  total: number;
  items: OrderItem[];
}

/** Spring Data style Page<T> */
export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
