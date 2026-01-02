"use client";
import { user as User } from "@/app/generated/prisma";
import { useEffect, useRef, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>();

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get<ApiResponse<User[]>>(`/admin/users`);
      setUsers(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gridRef = useRef<AgGridReact>(null);
  const rowData = users;
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
          columnDefs={columnDefs}
          domLayout="autoHeight"
          autoSizePadding={8}
          rowHeight={40}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}
