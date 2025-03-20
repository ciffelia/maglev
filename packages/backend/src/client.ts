import { hc } from "hono/client";

import type { AppType } from ".";

// this is a trick to calculate the type when compiling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typedHc = hc<AppType>;

export type TypedHc = typeof typedHc;
