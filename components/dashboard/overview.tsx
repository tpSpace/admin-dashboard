"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { SalesData } from "@/types/dashboard"

interface OverviewProps {
  data?: SalesData[];
}

const defaultData: SalesData[] = [
  {
    revenue: 4000,
    orders: 2400,
    date: "Jan 22",
  },
  {
    revenue: 3000,
    orders: 1398,
    date: "Feb 22",
  },
  {
    revenue: 2000,
    orders: 9800,
    date: "Mar 22",
  },
  {
    revenue: 2780,
    orders: 3908,
    date: "Apr 22",
  },
  {
    revenue: 1890,
    orders: 4800,
    date: "May 22",
  },
  {
    revenue: 2390,
    orders: 3800,
    date: "Jun 22",
  },
]

export function Overview({ data = defaultData }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 