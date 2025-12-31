"use client";

import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from "ag-grid-community";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye } from "lucide-react";
import SelectFilter from "@/components/table/SelectFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Payment = {
  id: number;
  amountCents: number;
  provider: string;
  paidAt: string;
  status: string;
  currency: string;
  bookingId: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

interface FilterParams {
  paymentId: number | null;
  bookingId: number | null;
  userEmail: string;
  paidDate: string;
}

export default function PaymentsListPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterState, setFilterState] = useState<FilterParams>({
    paymentId: null,
    bookingId: null,
    userEmail: "",
    paidDate: "",
  });

  const fetchPayements = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filterState.paymentId)
        params.append("paymentId", String(filterState.paymentId));
      if (filterState.bookingId)
        params.append("bookingId", String(filterState.bookingId));
      if (filterState.userEmail)
        params.append("userEmail", filterState.userEmail);
      if (filterState.paidDate) params.append("paidDate", filterState.paidDate);
      const token = localStorage.getItem("authToken") || "";
      const apiRes = await fetch(`/api/admin/payments?${params.toString()}`, {
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
      },
      {
        headerName: "Booking Id",
        field: "bookingId",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "User Email",
        field: "user.email",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Amount",
        field: "amountCents",
        flex: 2,
        cellClass: "font-semibold text-black",
      },
      {
        headerName: "Currency",
        field: "currency",
        flex: 2,
        cellClass: "font-semibold text-black",
        valueFormatter: (params: ValueFormatterParams) => {
          return params.value ? String(params.value).toUpperCase() : "";
        },
      },
      {
        headerName: "Mode",
        field: "provider",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: SelectFilter,
        filterParams: {
          values: ["CARD", "CASH"],
        },
      },
      {
        headerName: "Status",
        field: "status",
        flex: 2,
        cellClass: "font-semibold text-black",
        filter: SelectFilter,
        filterParams: {
          values: ["SUCCEEDED", "REFUNDED", "DISPUTED", "FAILED"],
        },
      },
      {
        headerName: "Paid Date",
        field: "paidAt",
        flex: 2,
        cellClass: "font-semibold text-black",

        valueFormatter: (params: ValueFormatterParams) => {
          return new Date(params.value).toLocaleString("en-US");
        },
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
    [],
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
      <div className="flex flex-col gap-2 py-2">
        <h2 className="text-lg font-semibold">Search Payments</h2>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="space-y-2">
            <label>Payment ID</label>
            <Input
              placeholder="Payment ID"
              type="number"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  paymentId: Number(e.target.value),
                }));
              }}
            />
          </div>
          <div className="space-y-2">
            <label>Booking ID</label>
            <Input
              placeholder="Booking ID"
              type="number"
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  bookingId: Number(e.target.value),
                }));
              }}
            />
          </div>
          <div className="space-y-2">
            <label>User Email</label>
            <Input
              placeholder="User E-mail"
              type="email"
              className=""
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  userEmail: e.target.value,
                }));
              }}
            />
          </div>
          <div className="space-y-2">
            <label>Paid Date</label>
            <Input
              placeholder="Paid On"
              type="date"
              className=""
              onChange={(e) => {
                setFilterState((prev) => ({
                  ...prev,
                  paidDate: e.target.value,
                }));
              }}
            />
          </div>
          <Button className="bg-blue-400 mt-5" onClick={fetchPayements}>
            Filter
          </Button>
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
