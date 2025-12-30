"use client";

import { ColDef, ICellRendererParams } from "ag-grid-community";
import { payment as Payment } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye } from "lucide-react";

export default function PaymentsListPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPayements = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken") || "";
      const apiRes = await fetch("/api/admin/payments", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!apiRes.ok) {
        throw new Error("Failed to Fetch Payments");
      }
      const res = await apiRes.json();
      console.log(res);
      setPayments(res.data);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayements();
  }, []);
  const gridRef = useRef<AgGridReact>(null);
  const rowData: Payment[] = payments ?? [];

  const columnDefs = useMemo<ColDef<Payment>[]>(
    () => [
      {
        headerName: "Payment ID",
        field: "id",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: true,
      },
      {
        headerName: "Amount",
        field: "amountCents",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: true,
      },
      {
        headerName: "Email",
        field: "receiptEmail",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Paid Date",
        field: "paidAt",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      {
        headerName: "Actions",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<Payment>) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                router.push(`/back_office/bookings/${params.data?.id}`);
              }}
              className="p-1 rounded hover:bg-blue-100"
              title="Edit"
            >
              <Eye className="text-gray-800" size={18} />
            </button>
          </div>
        ),
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Payments Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, search, and filter all your Payments in one place.
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
          loading={isLoading}
        />
      </div>
    </div>
  );
}
