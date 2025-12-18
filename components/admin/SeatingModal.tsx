import { seat as Seat } from "@/app/generated/prisma";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface SeatingProps {
  onClose: () => void;
  audiId?: number;
}
const SeatingModal: React.FC<SeatingProps> = ({ audiId, onClose }) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const fetchSeatings = async () => {
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch("/api/admin/seats", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed TO get Seats");
      } else {
        const data = await res.json();
        setSeats(data.data);
        console.log(data.data);
      }
    } catch (error) {
      console.error(`Error ${error}`);
    }
  };
  useEffect(() => {
    fetchSeatings();
  }, []);
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {audiId ? "Edit" : "Add"} Auditorium
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative px-4 pt-5 pb-3">
          <div className="relative mx-auto max-w-2xl">
            <div className="h-1.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-6 w-3/4 bg-gradient-to-b from-rose-400/15 to-transparent blur-md" />
            <p className="text-center text-[10px] text-black mt-2 uppercase tracking-[0.25em]">
              Screen this way
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingModal;
