import { Router, Route } from "porto/server";
import { env } from "@/env";

export const POST = Router({ basePath: "/api/porto" }).route(
  "/merchant",
  Route.merchant({
    address: env.MERCHANT_ADDRESS as `0x${string}`,
    key: env.MERCHANT_PRIVATE_KEY as `0x${string}`,
    // Optionally handle which requests should be sponsored.
    // sponsor(request) {
    //   return true
    // },
  })
);

