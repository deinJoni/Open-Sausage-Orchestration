import { Route, Router } from "porto/server";
import type { Address } from "viem";
import { env } from "@/env";

export const route = Router({ basePath: "/porto" }).route(
  "/merchant",
  Route.merchant({
    address: env.MERCHANT_ADDRESS as Address,
    key: env.MERCHANT_PRIVATE_KEY as Address,
    sponsor(_request) {
      console.log("sponsor called with request:", _request);
      return true;
    },
  })
);

export const GET = route.fetch;
export const OPTIONS = route.fetch;
export const POST = route.fetch;
