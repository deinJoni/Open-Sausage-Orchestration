"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSendTip } from "@/hooks/useSendTip";
import { useEthToUsd } from "@/hooks/useEthToUsd";

interface DonationModalProps {
	artistEnsName: string;
	onClose: () => void;
}

const PRESET_AMOUNTS = [0.01, 0.05, 0.1, 0.5];

export function DonationModal({ artistEnsName, onClose }: DonationModalProps) {
	const [amount, setAmount] = useState("0.01");
	const [customAmount, setCustomAmount] = useState("");
	const { mutate, isPending } = useSendTip();
	const { convertToUsd } = useEthToUsd();

	const selectedAmount = customAmount || amount;
	const usdValue = convertToUsd(Number.parseFloat(selectedAmount));

	const handleSend = async () => {
		await mutate(artistEnsName, selectedAmount);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
			<Card className="w-full max-w-md border-zinc-800 bg-zinc-900 p-6">
				<div className="mb-6">
					<h3 className="mb-2 font-bold text-white text-xl">
						💜 Send a Gift to {artistEnsName}
					</h3>
					<p className="text-sm text-zinc-400">
						Support this artist with an ETH tip
					</p>
				</div>

				<div className="mb-6">
					<Label>Select Amount (ETH)</Label>
					<div className="mt-3 grid grid-cols-4 gap-2">
						{PRESET_AMOUNTS.map((presetAmount) => (
							<button
								className={`rounded-lg border py-3 font-medium transition-colors ${
									amount === presetAmount.toString() && !customAmount
										? "border-purple-500 bg-purple-500/20 text-purple-300"
										: "border-zinc-700 text-zinc-400 hover:border-zinc-600"
								}`}
								key={presetAmount}
								type="button"
								onClick={() => {
									setAmount(presetAmount.toString());
									setCustomAmount("");
								}}
							>
								{presetAmount}
							</button>
						))}
					</div>

					<div className="mt-4">
						<Label htmlFor="custom">Custom Amount</Label>
						<Input
							className="mt-2"
							id="custom"
							min="0"
							placeholder="0.0"
							step="0.001"
							type="number"
							value={customAmount}
							onChange={(e) => setCustomAmount(e.target.value)}
						/>
					</div>

					<div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
						<div className="flex justify-between text-sm">
							<span className="text-zinc-500">Amount:</span>
							<span className="font-mono font-semibold text-white">
								{selectedAmount} ETH
							</span>
						</div>
						<div className="mt-2 flex justify-between text-sm">
							<span className="text-zinc-500">USD equivalent:</span>
							<span className="font-mono text-zinc-400">
								≈ ${usdValue.toFixed(2)}
							</span>
						</div>
					</div>
				</div>

				<div className="flex gap-3">
					<Button
						className="flex-1"
						disabled={isPending}
						variant="outline"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
						disabled={isPending || !selectedAmount || Number.parseFloat(selectedAmount) <= 0}
						onClick={handleSend}
					>
						{isPending ? "Sending..." : "Send Gift 💜"}
					</Button>
				</div>

				<p className="mt-4 text-center text-xs text-zinc-500">
					This will send ETH directly to the artist's wallet
				</p>
			</Card>
		</div>
	);
}
