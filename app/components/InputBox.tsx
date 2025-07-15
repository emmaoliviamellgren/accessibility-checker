"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PageSpeedModel } from "../pagespeedModel";
import Result from "./Result";
import LoadingState from "./LoadingState";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateURL } from "../utils";

const InputBox = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [result, setResult] = useState<Partial<PageSpeedModel> | null>(null);

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			const validation = validateURL(inputValue);
			if (validation.isValid) {
				fetchResults();
			} else {
				setValidationError(validation.error || "Invalid URL");
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		if (validationError) {
			setValidationError(null);
		}
	};

	const fetchResults = async () => {
		const validation = validateURL(inputValue);
		if (!validation.isValid) {
			setValidationError(validation.error || "Invalid URL");
			return;
		}

		setValidationError(null);
		setError(null);

		if (result) {
			setResult(null);
		}
		setLoading(true);

		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
		}, 60000);

		try {
			const URL = validation.normalizedUrl!;
			const res = await fetch(
				`/api/pagespeed?url=${encodeURIComponent(
					URL
				)}&category=performance&category=accessibility&category=best-practices&category=seo`,
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
				setError("Request timed out!");
			} else {
				console.log("Fetch failed:", error);
				setError("Failed to analyze website");
			}
		} finally {
			clearTimeout(timeout);
			setLoading(false);
		}
	};

	const retryRequest = () => {
		setError(null);
		setValidationError(null);
		fetchResults();
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 0 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.2 }}
				className={`relative group group-focus-within transition-all ${
					!result ? "mt-32" : "mt-16"
				}`}>
				<Input
					disabled={loading || error !== null}
					placeholder="Enter website URL..."
					className={cn(
						"w-auto min-w-96 placeholder:text-gray-50/50 ring ring-gray-50/20 border-0 pl-4 pr-[85px] py-6 focus-visible:ring-gray-50/50  focus-visible:ring-[1px] focus:ring-[1px] group-focus:ring-gray-50/50 group-focus-visible:ring-gray-50/50 text-gray-50/90"
					)}
					type="url"
					value={inputValue}
					aria-label="Enter URL to check performance"
					aria-required="true"
					aria-invalid={!!validationError}
					onChange={handleInputChange}
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
				{validationError && (
					<motion.p
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute -bottom-6 left-0 text-xs text-red-400">
						{validationError}
					</motion.p>
				)}
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
					<LoadingState />
				</div>
			)}
			{error && (
				<div className="flex flex-col items-center gap-4 mt-16">
					{error && (
						<span className="flex items-center gap-1">
							<p className="text-sm text-muted-foreground">
								Failed with error:
							</p>
							<code className="bg-black/40 text-gray-50 relative rounded-sm px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
								{error}
							</code>
						</span>
					)}
					<div className="flex items-center gap-2">
						<p className="text-sm text-muted-foreground">Retry?</p>
						<Button
							variant="outline"
							size="icon"
							className="cursor-pointer size-6 text-gray-50/60 bg-gray-50/10 ring-gray-50/20 ring border-0"
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
