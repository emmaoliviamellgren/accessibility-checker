"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import tips from "../tips.json";

const LoadingState = () => {
	const [index, setIndex] = useState(0);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev < 30) return prev + Math.random() * 8;
				if (prev < 60) return prev + Math.random() * 4;
				if (prev < 85) return prev + Math.random() * 2;
				if (prev < 95) return prev + Math.random() * 1;
				return prev;
			});
		}, 200);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % tips.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const tip = tips[index];

	return (
		<div className="text-center mt-4">
			<p className="text-xs mb-2 text-gray-50/60">
				Analyzing website, {Math.round(Math.min(progress, 95))}% done...
			</p>
			<div className="w-[350px] h-0.5 bg-gray-50/10 rounded-full mx-auto">
				<div 
					className="h-full bg-gradient-to-r from-gray-50/30 to-gray-50/80 rounded-full transition-all duration-200 ease-out"
					style={{ width: `${Math.min(progress, 95)}%` }}
				/>
			</div>
			<p className="text-xs mb-2 mt-12 text-gray-50/60">
				In the meantime, here are some tips to get you started:
			</p>
			<AnimatePresence mode="wait">
				<motion.div
					key={tip.tip}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.5 }}
					className="text-sm text-gray-50/80">
					<p>{tip.tip}</p>
					<p className="text-xs text-gray-50/20">({tip.source})</p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default LoadingState;
