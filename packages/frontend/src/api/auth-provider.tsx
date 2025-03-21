/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return children;
};

export const useAuth = (): { token?: string | undefined } => {
  return { token: "dummy-token" };
};
