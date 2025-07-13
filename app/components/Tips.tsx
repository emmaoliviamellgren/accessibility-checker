'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import tips from "../tips.json";

const Tips = () => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % tips.length);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const tip = tips[index];

	return (
		<div className="text-center mt-4">
            <p className="text-xs mb-2 text-muted-foreground">This might take a while, so here&apos;s some tips to get you started:</p>
			<AnimatePresence mode="wait">
				<motion.div
					key={tip.tip}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.5 }}
					className="text-sm italic text-gray-500">
					<p>{tip.tip}</p>
					<p className="text-xs text-gray-400">
						({tip.source})
					</p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default Tips;
