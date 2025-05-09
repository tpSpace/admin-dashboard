"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { DashboardMetrics, DashboardData, SalesData, RecentSale } from "@/types/dashboard";
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/lib/api/dashboard-api';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
}

function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}

// Mock data as fallback
const mockMetrics: DashboardMetrics = {
  totalRevenue: 45231.89,
  totalOrders: 2350,
  activeCustomers: 12234,
  conversionRate: 2.4,
  revenueChange: 20.1,
  ordersChange: 180.1,
  customersChange: 19,
  conversionChange: 0.3
};

const mockSalesData: SalesData[] = [
  { revenue: 4000, orders: 2400, date: "Jan 22" },
  { revenue: 3000, orders: 1398, date: "Feb 22" },
  { revenue: 2000, orders: 9800, date: "Mar 22" },
  { revenue: 2780, orders: 3908, date: "Apr 22" },
  { revenue: 1890, orders: 4800, date: "May 22" },
  { revenue: 2390, orders: 3800, date: "Jun 22" },
];

const mockRecentSales: RecentSale[] = [
  { id: "1", name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999.00, avatarUrl: "/avatars/01.png" },
  { id: "2", name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39.00, avatarUrl: "/avatars/02.png" },
  { id: "3", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: 299.00, avatarUrl: "/avatars/03.png" },
  { id: "4", name: "William Kim", email: "will@email.com", amount: 99.00, avatarUrl: "/avatars/04.png" },
  { id: "5", name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39.00, avatarUrl: "/avatars/05.png" }
];

const mockDashboardData: Partial<DashboardData> = {
  metrics: mockMetrics,
  salesTrend: mockSalesData,
  recentSales: mockRecentSales
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery<DashboardData, Error>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col justify-center items-center">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  // Use fetched data if available, otherwise fall back to mock data
  const dashboardData = isError || !data ? mockDashboardData : data;
  const metrics = dashboardData.metrics || mockMetrics;
  const salesTrend = dashboardData.salesTrend || mockSalesData;
  const recentSales = dashboardData.recentSales || mockRecentSales;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          {isError && (
            <p className="text-sm text-yellow-500">Using mock data (API unavailable)</p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            change={`${metrics.revenueChange}% from last month`}
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders.toLocaleString()}
            change={`${metrics.ordersChange}% from last month`}
          />
          <MetricCard
            title="Active Customers"
            value={metrics.activeCustomers.toLocaleString()}
            change={`${metrics.customersChange}% from last month`}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            change={`${metrics.conversionChange}% from last month`}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={salesTrend} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales sales={recentSales} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
