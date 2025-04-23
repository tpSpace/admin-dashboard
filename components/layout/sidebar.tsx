// src/components/layout/Sidebar.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { LogOut } from "lucide-react";

export default function Sidebar() {
  const { isMinimized, toggleSidebar } = useSidebarStore();
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop() || "products";

  const handleLogout = () => {
    clearAuth(); // Clear authStore state
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Clear JWT cookie
    router.push("/login");
  };

  return (
    <div
      className={`bg-zinc-800 dark:bg-zinc-900 text-foreground h-screen flex flex-col transition-all duration-300 ${
        isMinimized ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!isMinimized && <h2 className="text-xl font-bold">Admin Dashboard</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-foreground hover:bg-zinc-700 dark:hover:bg-zinc-800"
        >
          {isMinimized ? "→" : "←"}
        </Button>
      </div>
      <Tabs
        value={currentTab}
        onValueChange={(value) => router.push(`/dashboard/${value}`)}
        className="flex-1"
      >
        <TabsList className="flex flex-col h-full bg-zinc-800 dark:bg-zinc-900">
          <TabsTrigger
            value="products"
            className={`w-full justify-start px-4 py-2 text-foreground hover:bg-zinc-700 dark:hover:bg-zinc-800 ${
              isMinimized ? "justify-center" : ""
            }`}
          >
            {isMinimized ? "P" : "Products"}
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className={`w-full justify-start px-4 py-2 text-foreground hover:bg-zinc-700 dark:hover:bg-zinc-800 ${
              isMinimized ? "justify-center" : ""
            }`}
          >
            {isMinimized ? "O" : "Orders"}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button
        variant="ghost"
        className="m-4 text-foreground hover:bg-zinc-700 dark:hover:bg-zinc-800"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {!isMinimized && "Logout"}
      </Button>
    </div>
  );
}
