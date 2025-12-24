"use client";

import jwt, { JwtPayload } from "jsonwebtoken";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface LoggedUser {
  email?: string;
  roles?: string[];
  userId?: number;
  exp: number;
  iat: number;
}

type RoleContextValue = {
  loggedUser: LoggedUser | null;
  loading: boolean;
  setloggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [loggedUser, setloggedUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    const decoded = jwt.decode(token);
    console.log("Decoded User", decoded);

    if (decoded && typeof decoded === "object") {
      console.log("Decoded object:", decoded);
      const tokenRole = decoded as LoggedUser;
      console.log("Token role:", tokenRole);
      if (tokenRole) Promise.resolve().then(() => setloggedUser(tokenRole));
    }
    Promise.resolve().then(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({ loggedUser, loading, setloggedUser }),
    [loggedUser, loading]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
