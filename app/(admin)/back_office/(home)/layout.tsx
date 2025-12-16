import type { Metadata } from "next";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { RoleProvider } from "@/app/context/AuthContext";

export const metadata: Metadata = {
  title: "Great Events Center - Admin",
  description: "Admin Panel - Manage Your Events and Venues",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </RoleProvider>
  );
}
