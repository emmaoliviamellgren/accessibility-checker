"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PageSpeedModel } from "../pagespeedModel";
import Result from "./Result";
import Tips from "./Tips";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const InputBox = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<Partial<PageSpeedModel> | null>(null);

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim() !== "") {
			fetchResults();
		}
	};

	const fetchResults = async () => {
		setLoading(true);

		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
		}, 30000);

		try {
			const res = await fetch(
				`/api/pagespeed?url=${encodeURIComponent(inputValue)}`,
				{ signal: controller.signal }
			);
			if (!res.ok) {
				throw new Error(`HTTP error: ${res.status}`);
			}
			const json = await res.json();
			setResult(json);
			setLoading(false);
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				console.log("Fetch timed out");
				setError("Request timed out! :(");
			} else {
				console.log("Fetch failed:", error);
			}
		} finally {
			clearTimeout(timeout);
			setLoading(false);
		}
	};

	const retryRequest = () => {
		setError(null);
		fetchResults();
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.4 }}
				className={`relative group group-focus-within transition-all ${
					!result ? "mt-[15%]" : "mt-16"
				}`}>
				<Input
					disabled={loading || error !== null}
					placeholder="Enter website URL..."
					className={cn(
						"w-auto min-w-96 placeholder:text-gray-50/50 ring ring-gray-50/20 border-0 pl-4 pr-[85px] py-6 focus-visible:ring-gray-50/50  focus-visible:ring-[1px] focus:ring-[1px] group-focus:ring-gray-50/50 group-focus-visible:ring-gray-50/50 text-gray-50/90"
					)}
					type="url"
					aria-label="Enter URL to check accessibility"
					aria-required="true"
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyPress}
				/>
				<div
					className={`absolute top-1.75 right-1.5 pr-2 pt-2 ${
						loading && "opacity-50"
					}`}>
					<kbd className="bg-gray-50/10 transition-all outline outline-gray-50/20 group-focus-within:outline-gray-50/50 text-gray-50/40 pointer-events-none flex h-5 items-center justify-center gap-1 rounded px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3">
						<span>ENTER</span>
						<span>↵</span>
					</kbd>
				</div>
			</motion.div>
			{result && (
				<Result
					result={result}
					error={error}
					setError={setError}
				/>
			)}
			{loading && (
				<div className="flex flex-col items-center justify-center mt-16">
					<motion.div
						className="h-6 w-6 rounded-full border-2 border-t-transparent border-slate-800/20"
						animate={{ rotate: 360 }}
						transition={{
							repeat: Infinity,
							duration: 1,
							ease: "linear",
						}}
					/>
					<Tips />
				</div>
			)}
			{error && (
				<div className="flex flex-col items-center gap-2 mt-16">
					<p className="text-sm text-red-900">{error}</p>
					<div className="flex items-center gap-2">
						<p className="text-sm text-muted-foreground">Retry?</p>
						<Button
							variant="outline"
							size="icon"
							className="cursor-pointer size-6"
							onClick={retryRequest}>
							<RotateCcw className="size-3" />
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default InputBox;
