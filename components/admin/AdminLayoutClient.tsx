"use client";
import { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { SidebarProvider, useSidebar } from "@/components/admin/SidebarContext";
import { cn } from "@/lib/utils";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useRole } from "@/app/context/AuthContext";
import LoginPage from "@/app/(admin)/back_office/login/page";
import LoadingPage from "../elements/LoadingPage";

function MainContent({ children }: { children: ReactNode }) {
  const { isExpanded } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 min-h-screen transition-all duration-300 ease-in-out",
        isExpanded ? "ml-72" : "ml-16"
      )}
    >
      <div className="p-6 lg:p-8">{children}</div>
    </main>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  ModuleRegistry.registerModules([AllCommunityModule]);
  const { loggedUser, loading } = useRole();
  if (Array.isArray(loggedUser?.roles) && loggedUser.roles.includes("Admin")) {
    return (
      <SidebarProvider>
        <div className="bg-gray-50 min-h-screen flex">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    );
  }
  if (loading) {
    return <LoadingPage />;
  }
  return <LoginPage />;
}
