import { Badge } from "@/components/ui/badge";
import { PageSpeedModel } from "../pagespeedModel";
import { motion } from "framer-motion";
import { BadgeQuestionMark } from "lucide-react";
import {
	rateUXCategory,
	ratePerformanceScore,
	informativeLinks,
	getBadgeClasses,
	rateTimeBasedMetric,
	Rating,
} from "../utils";

interface Props {
	result: Partial<PageSpeedModel>;
	error: string | null;
	setError: (error: string | null) => void;
}

const Result = ({ result, setError }: Props) => {
	if (!result || (!result.lighthouseResult && !result.loadingExperience)) {
		setError("An error occurred");
		return null;
	}

	const { lighthouseResult, loadingExperience } = result;

	const renderMetric = (
		label: string,
		value?: string | null,
		index?: number,
		isUXMetric: boolean = false
	) => {
		let rating: Rating | null = null;

		if (value && value !== "No data available") {
			if (isUXMetric) {
				rating = rateUXCategory(value);
			} else if (
				label.includes("Performance") ||
				label.includes("Accessibility") ||
				label.includes("Best Practices") ||
				label.includes("SEO")
			) {
				// For percentage scores, extract the number
				const percentageScores = value.match(/(\d+)%/);
				if (percentageScores) {
					rating = ratePerformanceScore(percentageScores[1]);
				}
			} else {
				// For time-based metrics (Performance Audits)
				rating = rateTimeBasedMetric(label, value);
			}
		}

		return (
			<motion.div
				key={label}
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: (index ?? 0) * 0.1, duration: 0.4 }}
				className="flex flex-col rounded-lg p-4 space-y-3 justify-between shadow-sm bg-gray-50/10 outline outline-gray-50/20 transition-colors w-[300px] h-auto">
				<div className="flex flex-1 gap-4 items-baseline justify-between">
					<p className="text-sm text-gray-300/60">{label}</p>
					<div className="flex items-center gap-2 flex-nowrap">
						{value && value !== "No data available" && rating && (
							<Badge
								className={`text-[9px] tracking-tight w-fit uppercase ${getBadgeClasses(
									rating
								)}`}>
								{rating}
							</Badge>
						)}
						{informativeLinks[
							label as keyof typeof informativeLinks
						] && (
							<a
								href={
									informativeLinks[
										label as keyof typeof informativeLinks
									]
								}
								target="_blank"
								rel="noopener noreferrer"
								className="bg-gray-50/10 p-0.5 rounded-full outline outline-gray-50/20 hover:outline-gray-50/80 hover:text-gray-50/80 text-gray-50/40 transition-colors">
								<BadgeQuestionMark size={16} />
							</a>
						)}
					</div>
				</div>

				{value && value !== "No data available" ? (
					<>
						<p className="font-light text-xl text-gray-50">
							{value}
						</p>
					</>
				) : (
					<p className="text-sm text-gray-50/20 font-light">
						No data available
					</p>
				)}
			</motion.div>
		);
	};

	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	};

	const uxMetrics = [
		{
			label: "First Contentful Paint (Category)",
			value:
				loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS &&
				capitalize(
					loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category
				),
		},
		{
			label: "Interaction to Next Paint (Category)",
			value:
				loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT &&
				capitalize(
					loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.category
				),
		},
	];

	const auditMetrics = [
		{
			label: "First Contentful Paint",
			value: lighthouseResult?.audits["first-contentful-paint"]
				?.displayValue,
		},
		{
			label: "Speed Index",
			value: lighthouseResult?.audits["speed-index"]?.displayValue,
		},
		{
			label: "Largest Contentful Paint",
			value: lighthouseResult?.audits["largest-contentful-paint"]
				?.displayValue,
		},
		{
			label: "Total Blocking Time",
			value: lighthouseResult?.audits["total-blocking-time"]
				?.displayValue,
		},
		{
			label: "Time to Interactive",
			value: lighthouseResult?.audits["interactive"]?.displayValue,
		},
	];

	const categoryMetrics = [
		{
			label: "Performance",
			value:
				lighthouseResult?.categories?.performance?.score != null
					? `${Math.round(
							lighthouseResult.categories.performance.score * 100
					  )}%`
					: null,
		},
		{
			label: "Accessibility",
			value:
				lighthouseResult?.categories?.accessibility?.score != null
					? `${Math.round(
							lighthouseResult.categories.accessibility.score *
								100
					  )}%`
					: null,
		},
		{
			label: "Best Practices",
			value:
				lighthouseResult?.categories?.["best-practices"]?.score != null
					? `${Math.round(
							lighthouseResult.categories["best-practices"]
								.score * 100
					  )}%`
					: null,
		},
		{
			label: "SEO",
			value:
				lighthouseResult?.categories?.seo?.score != null
					? `${Math.round(
							lighthouseResult.categories.seo.score * 100
					  )}%`
					: null,
		},
	];

	return (
		<section className="flex flex-col gap-6 mt-12 px-4 md:px-8 lg:px-12">
			<h1 className="text-base font-medium text-gray-50">
				User Experience Metrics
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{uxMetrics.map((m, i) =>
					renderMetric(m.label, m.value, i, true)
				)}
			</div>

			<h1 className="text-base font-medium text-gray-50">
				Performance Audits
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{auditMetrics.map((m, i) =>
					renderMetric(m.label, m.value, i + uxMetrics.length, false)
				)}
			</div>

			<h1 className="text-base font-medium text-gray-50">
				Overall Scores
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{categoryMetrics.map((m, i) =>
					renderMetric(
						m.label,
						m.value,
						i + uxMetrics.length + auditMetrics.length,
						false
					)
				)}
			</div>
		</section>
	);
};

export default Result;
