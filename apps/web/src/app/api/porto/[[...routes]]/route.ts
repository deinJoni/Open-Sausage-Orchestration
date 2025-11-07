import { Route, Router } from "porto/server";
import { L2_REGISTRAR_ADDRESS, L2_REGISTRY_ADDRESS } from "@/lib/contracts";

export const route = Router({ basePath: "/api/porto" }).route(
  "/merchant",
  Route.merchant({
    address: process.env.MERCHANT_ADDRESS as `0x${string}`,
    key: process.env.MERCHANT_PRIVATE_KEY as `0x${string}`,
    sponsor(request) {
      return request.calls.every(
        (call) =>
          call.to === L2_REGISTRAR_ADDRESS || call.to === L2_REGISTRY_ADDRESS
      );
    },
  })
);

export const GET = route.fetch;
export const OPTIONS = route.fetch;
export const POST = route.fetch;
