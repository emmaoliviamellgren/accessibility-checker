import { PageSpeedModel } from "../pagespeedModel";
import { motion } from "framer-motion";

interface Props {
	result: Partial<PageSpeedModel>;
	error: string | null;
	setError: (error: string | null) => void;
}

const Result = ({ result, error, setError }: Props) => {
	if (!result || (!result.lighthouseResult && !result.loadingExperience)) {
		setError("An error occurred :(");
		return null;
	}

	const { lighthouseResult, loadingExperience } = result;

	const renderMetric = (
		label: string,
		value?: string | null,
		index?: number
	) =>
		value ? (
			<motion.div
				key={label}
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: (index ?? 0) * 0.1, duration: 0.4 }}
				className="flex flex-col border rounded-lg p-4 shadow-sm bg-white">
				<p className="text-sm text-gray-500">{label}</p>
				<p className="font-medium text-lg">{value}</p>
			</motion.div>
		) : null;

	const uxMetrics = [
		{
			label: "First Contentful Paint (Category)",
			value: loadingExperience?.metrics?.FIRST_CONTENTFUL_PAINT_MS
				?.category,
		},
		{
			label: "Interaction to Next Paint (Category)",
			value: loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT
				?.category,
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
		<section className="flex flex-col gap-6 mt-12 px-4">
			<h1 className="text-lg font-semibold">User Experience Metrics</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{loadingExperience?.metrics ? (
					<>
						{uxMetrics.map((m, i) =>
							renderMetric(m.label, m.value, i)
						)}
					</>
				) : (
					<p className="text-sm text-gray-500">No data available</p>
				)}
			</div>

			<h1 className="text-lg font-semibold">Performance Audits</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{lighthouseResult?.audits ? (
					<>
						{auditMetrics.map((m, i) =>
							renderMetric(m.label, m.value, i + uxMetrics.length)
						)}
					</>
				) : (
					<p className="text-sm text-gray-500">No data available</p>
				)}
			</div>

			<h1 className="text-lg font-semibold">Overall Scores</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{lighthouseResult?.categories ? (
					<>
						{categoryMetrics.map((m, i) =>
							renderMetric(m.label, m.value, i)
						)}
					</>
				) : (
					<p className="text-sm text-gray-500">No data available</p>
				)}
			</div>

			{error && <p className="text-sm text-red-900">{error}</p>}
		</section>
	);
};

export default Result;
