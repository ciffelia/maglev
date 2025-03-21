import type { TypedHc } from "@magrev/backend/client";

import { hc } from "hono/client";
import React, { createContext, useContext } from "react";

export const ClientContext = createContext<ReturnType<TypedHc> | undefined>(
  undefined,
);

export const ClientProvider: React.FC<{
  children?: React.ReactNode | undefined;
}> = ({ children }) => {
  const client = (hc as unknown as TypedHc)("/");
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
