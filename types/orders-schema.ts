/** Single order line item */
export interface OrderItem {
  id: string; // Added this field from API response
  productId: string;
  productName: string;
  quantity: number;
  price: number; // Changed from unitPrice to price
}

/** A complete order record */
export interface Order {
  id: string;
  userId: string; // Changed from customerId to userId
  orderDate: string;
  status: string;
  totalAmount: number; // Changed from total to totalAmount
  items: OrderItem[];
  shippingAddress: string; // Added this field from API response
}

/** Spring Data style Page<T> */
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string>;
  timestamp: string;
}
