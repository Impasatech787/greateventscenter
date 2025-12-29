"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Settings, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useRole } from "@/app/context/AuthContext";
import { deleteSessionCookie } from "@/app/actions/clearCookies";

const ProfileDropDown = () => {
  const router = useRouter();
  const { loggedUser, setloggedUser } = useRole();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = (loggedUser?.email?.charAt(0) || "U").toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("authToken");
      setloggedUser(null);
      await deleteSessionCookie();
      setOpen(false);
      router.push("/signin");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="rounded-full bg-slate-500 text-white shadow-sm w-10 h-10 flex items-center justify-center hover:bg-slate-600 hover:shadow-md transition-shadow"
          aria-label="Open profile menu"
        >
          {initials}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-56 p-2 bg-white border-gray-200 shadow-lg"
      >
        <div className="px-2 py-1.5">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {loggedUser?.email ?? "User"}
          </p>
        </div>
        <Separator className="my-1" />

        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setOpen(false)}
        >
          <Link href="/profile">
            <Settings className="w-4 h-4" />
            Profile Settings
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setOpen(false)}
        >
          <Link href="/profile/bookings">
            <Ticket className="w-4 h-4" />
            My Bookings
          </Link>
        </Button>

        <Separator className="my-1" />

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-red-700 hover:text-red-700"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? "Logging out…" : "Logout"}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileDropDown;
