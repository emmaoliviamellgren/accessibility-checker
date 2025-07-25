'use client'

import { motion } from "framer-motion";
import InputBox from "./components/InputBox";

export default function Home() {
	return (
		<main className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,rgba(100,100,100,0.5)_0%,rgba(10,10,10,1)_80%)] py-14">
			<header>
				<motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="font-light text-center pt-8 text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-50/30 to-gray-300">
					Check the performance of your website
				</motion.h1>
			</header>
			<section className="flex min-h-screen flex-col items-center">
				<InputBox />
			</section>
		</main>
	);
}
