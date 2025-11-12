import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { API_URLS } from "@/lib/constants";

type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string; // in Wei
  timeStamp: string; // Unix timestamp
  blockNumber: string;
  isError: string; // "0" or "1"
};

type BasescanResponse = {
  status: string;
  message: string;
  result: Transaction[];
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate address format
    if (!isAddress(address)) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }

    // Get Basescan API key from environment
    const apiKey = process.env.BASESCAN_API_KEY;
    if (!apiKey) {
      console.error("BASESCAN_API_KEY not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Fetch normal transactions from Basescan
    const url = new URL(API_URLS.BASESCAN);
    url.searchParams.set("module", "account");
    url.searchParams.set("action", "txlist");
    url.searchParams.set("address", address);
    url.searchParams.set("startblock", "0");
    url.searchParams.set("endblock", "99999999");
    url.searchParams.set("page", "1");
    url.searchParams.set("offset", "20"); // Last 20 transactions
    url.searchParams.set("sort", "desc"); // Most recent first
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Basescan API error: ${response.statusText}`);
    }

    const data = (await response.json()) as BasescanResponse;

    // Check for API errors
    if (data.status !== "1") {
      // Status "0" usually means no transactions found, not an error
      if (data.message === "No transactions found") {
        return NextResponse.json({ transactions: [] });
      }
      throw new Error(`Basescan API error: ${data.message}`);
    }

    // Filter successful transactions and format response
    const transactions = data.result
      .filter((tx) => tx.isError === "0") // Only successful transactions
      .map((tx) => ({
        hash: tx.hash,
        from: tx.from.toLowerCase(),
        to: tx.to.toLowerCase(),
        value: tx.value, // Wei as string
        timestamp: Number.parseInt(tx.timeStamp, 10),
        blockNumber: Number.parseInt(tx.blockNumber, 10),
      }));

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
