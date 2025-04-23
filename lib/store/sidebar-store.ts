import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isMinimized: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isMinimized: false,
      toggleSidebar: () =>
        set((state: SidebarState) => ({ isMinimized: !state.isMinimized })),
      setSidebarOpen: (open: boolean) => set({ isMinimized: !open }),
    }),
    {
      name: "sidebar-storage", // name for the persisted data in localStorage

      partialize: (state: SidebarState) => ({
        isMinimized: state.isMinimized,
      }),
    }
  )
);
