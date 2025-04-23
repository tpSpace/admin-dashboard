"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ClipboardList,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { ModeToggle } from "@/components/theme-toggle";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isMinimized?: boolean;
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  isMinimized,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      title={isMinimized ? label : undefined}
    >
      <Icon className="h-5 w-5" />
      {!isMinimized && <span>{label}</span>}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isMinimized, toggleSidebar } = useSidebarStore();

  // For mobile navigation only
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: ShoppingBag },
    { href: "/dashboard/orders", label: "Orders", icon: ClipboardList },
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-card transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isMinimized ? "w-16" : "w-64"
        )}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center px-4 border-b">
          {!isMinimized && (
            <span className="text-xl font-semibold">Admin Panel</span>
          )}
          {isMinimized && (
            <span className="text-xl font-semibold mx-auto">AP</span>
          )}

          {/* Minimize toggle button for desktop */}
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto", isMinimized && "mx-auto")}
            onClick={toggleSidebar}
            title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            {isMinimized ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-5 w-5" />
            )}
          </Button>

          {/* Close button for mobile only */}
          {!isMinimized && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                isMinimized={isMinimized}
              />
            ))}
          </div>
        </nav>
        {/* Theme toggle */}
        <div className="p-3">
          <ModeToggle />
        </div>
        {/* Footer area */}
        <div className="border-t p-3">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50",
              isMinimized && "px-2 justify-center"
            )}
            onClick={() => {
              console.log("Logout");
              redirect("/login");
            }}
          >
            <LogOut className={cn("h-4 w-4", !isMinimized && "mr-2")} />
            {!isMinimized && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
