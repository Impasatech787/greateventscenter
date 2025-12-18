"use client";
import { user as User } from "@/app/generated/prisma";
import { useApi } from "@/hooks/useApi";
import { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ICellRendererParams } from "ag-grid-community";
import { Trash2 } from "lucide-react";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

export default function UsersPage() {
  const { data, loading, call } = useApi<User[]>();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken") || "";
    await call("/api/admin/users", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteMovie = async () => {
    if (!selectedUserId) return;

    const token = localStorage.getItem("authToken") || "";
    const response = await fetch(`/api/admin/movies/${selectedUserId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete venue");
    }

    setIsDeleteOpen(false);
    setSelectedUserId(null);
    setSelectedUserName("");
    await fetchUsers();
  };

  const gridRef = useRef<AgGridReact>(null);
  const rowData = data;
  const columnDefs = useMemo(
    () => [
      {
        headerName: "First Name",
        field: "firstName",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Last Name",
        field: "lastName",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Actions",
        field: "actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<User>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedUserId(params.data?.id ?? null);
                setSelectedUserName(params.data?.firstName ?? "");
                setIsDeleteOpen(true);
              }}
              className="p-1 rounded hover:bg-red-100"
              title="Delete"
            >
              <Trash2 className="text-red-400" size={18} />
            </button>
          </div>
        ),
        sortable: false,
        filter: false,
      },
    ],
    [],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Users Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Users in one place.
          </p>
        </div>
      </div>
      <div
        className=" rounded-xl border border-gray-200 shadow-sm bg-white"
        style={{ width: "100%" }}
      >
        <AgGridReact
          rowStyle={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#374151",
          }}
          ref={gridRef}
          rowData={rowData}
          loading={loading}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {/* Delete Venue Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUserId(null);
          setSelectedUserName("");
        }}
        onConfirm={handleDeleteMovie}
        title="Delete User"
        itemName={selectedUserName}
        itemType="User"
        description="This will permanently delete the user and all associated data."
      />
    </div>
  );
}
