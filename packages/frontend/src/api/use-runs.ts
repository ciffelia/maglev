import type { InferResponseType } from "hono";

import { useCallback } from "react";
import useSWR from "swr";

import { useClient } from "./client-provider";
import { HttpError } from "./error";

const endpoint = "GET /api/v1/run";

export const useRuns = () => {
  const client = useClient();

  const fetcher = useCallback(async () => {
    const res = await client.api.v1.run.$get();

    if (!res.ok) {
      throw new HttpError(endpoint, res);
    }

    return await res.json();
  }, [client]);

  return useSWR<InferResponseType<typeof client.api.v1.run.$get>, Error>(
    endpoint,
    fetcher,
  );
};
