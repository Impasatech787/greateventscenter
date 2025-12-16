"use client";

import jwt, { JwtPayload } from "jsonwebtoken";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { role as Role } from "../generated/prisma";

type RoleContextValue = {
  role: Role | null;
  loading: boolean;
  setRole: React.Dispatch<React.SetStateAction<Role | null>>;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = jwt.decode(token);
    console.log(decoded);

    if (decoded && typeof decoded === "object") {
      const tokenRole = (decoded as JwtPayload & { roles?: Role }).roles;
      if (tokenRole) setRole(tokenRole);
    }

    setLoading(false);
  }, []);

  const value = useMemo(() => ({ role, loading, setRole }), [role, loading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
