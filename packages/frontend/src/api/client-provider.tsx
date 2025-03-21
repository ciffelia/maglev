import type { TypedHc } from "@magrev/backend/client";

import { hc } from "hono/client";
import React, { createContext, useContext } from "react";

import { useAuth } from "./auth-provider";

export const ClientContext = createContext<ReturnType<TypedHc> | undefined>(
  undefined,
);

export const ClientProvider: React.FC<{
  children?: React.ReactNode | undefined;
}> = ({ children }) => {
  const { token } = useAuth();

  const headers: Record<string, string> = {};
  if (token !== undefined) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const client = (hc as unknown as TypedHc)("/", { headers });

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const client = useContext(ClientContext);
  if (!client) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return client;
};
