"use client";

import { get } from "http";
import jwt from "jsonwebtoken";
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
  getLoggedUser: () => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [loggedUser, setloggedUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getLoggedUser = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    const decoded = jwt.decode(token);

    if (decoded && typeof decoded === "object") {
      const tokenRole = decoded as LoggedUser;
      if (tokenRole) Promise.resolve().then(() => setloggedUser(tokenRole));
    }
    Promise.resolve().then(() => setLoading(false));
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  const value = useMemo(
    () => ({ loggedUser, loading, setloggedUser, getLoggedUser }),
    [loggedUser, loading]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}
