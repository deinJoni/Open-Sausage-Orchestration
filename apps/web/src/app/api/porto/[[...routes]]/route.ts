import { Route, Router } from "porto/server";
import type { Address } from "viem";
import { env } from "@/env";

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};

export const route = Router({ basePath: "api/porto" }).route(
  "/merchant",
  Route.merchant({
    address: env.MERCHANT_ADDRESS as Address,
    key: env.MERCHANT_PRIVATE_KEY as Address,
    sponsor(_request) {
      return true;
    },
  })
);

// Wrapper function to add CORS headers to responses
async function handleWithCors(
  request: Request,
  handler: typeof route.fetch
): Promise<Response> {
  const response = await handler(request);

  // Create a new response with CORS headers
  const newResponse = new Response(response.body, response);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newResponse.headers.set(key, value);
  }

  // Add Private Network Access header for Chrome security
  newResponse.headers.set("Access-Control-Allow-Private-Network", "true");

  return newResponse;
}

// Handle OPTIONS preflight requests
export function OPTIONS(request: Request) {
  const headers: Record<string, string> = { ...corsHeaders };

  // Handle Private Network Access (Chrome security feature for localhost access)
  if (request.headers.get("Access-Control-Request-Private-Network")) {
    headers["Access-Control-Allow-Private-Network"] = "true";
  }

  return new Response(null, {
    status: 204,
    headers,
  });
}

export function GET(request: Request): Promise<Response> {
  return handleWithCors(request, route.fetch);
}

export function POST(request: Request): Promise<Response> {
  return handleWithCors(request, route.fetch);
}

// TODO check maybe we dom't nneed these...
