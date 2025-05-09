import { Product } from "./products-schema";
import { Order, OrderItem } from "./orders-schema";

export interface SalesData {
  revenue: number;
  orders: number;
  date: string;
}

export interface RecentSale {
  id: string;
  name: string;
  email: string;
  amount: number;
  avatarUrl?: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  conversionChange: number;
}

// Enhanced types for dashboard
export interface ProductPerformance {
  product: Product;
  totalSales: number;
  revenue: number;
  unitsSold: number;
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  percentage: number;
  totalProducts: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

export interface InventoryMetrics {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  salesTrend: SalesData[];
  recentSales: RecentSale[];
  topProducts: ProductPerformance[];
  categoryPerformance: CategoryPerformance[];
  customerMetrics: CustomerMetrics;
  inventoryMetrics: InventoryMetrics;
  recentOrders: Order[];
}

// API Response types
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  errors: Record<string, string>;
  timestamp: string;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

export interface TimeRange {
  start: string;
  end: string;
  label: string;
}

// Filter types
export interface DashboardFilters {
  dateRange: TimeRange;
  categories?: string[];
  products?: string[];
  status?: string[];
} 