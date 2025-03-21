import { useLocalStorage } from "../hooks/use-local-storage";

interface UseAuth {
  setToken: (token?: string) => void;
  token: string | undefined;
}

export const useAuth = (): UseAuth => {
  const [token, setToken] = useLocalStorage("maglev-token");
  return { setToken, token };
};

export const buildAuthHeaders = (
  token: string | undefined,
): Record<string, string> => {
  if (token === undefined) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
