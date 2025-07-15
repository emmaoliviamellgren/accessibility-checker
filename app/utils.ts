export enum Rating {
	Good = "good",
	NeedsWork = "needs work",
	Poor = "poor",
}

const ratePerformanceScore = (score: string): Rating => {
	const numScore = parseInt(score);
	if (numScore >= 90) return Rating.Good;
	if (numScore >= 50) return Rating.NeedsWork;
	return Rating.Poor;
};

const rateUXCategory = (category: string): Rating => {
	if (category === "Fast") return Rating.Good;
	if (category === "Average") return Rating.NeedsWork;
	return Rating.Poor;
};

const rateTimeBasedMetric = (label: string, value: string): Rating => {
	// Extract numeric value and unit
	const timeMatch = value.match(/^([\d.]+)\s*(s|ms)$/);
	if (!timeMatch) return Rating.Poor;

	const numValue = parseFloat(timeMatch[1]);
	const unit = timeMatch[2];

	const timeInMs = unit === "s" ? numValue * 1000 : numValue;

	switch (label) {
		case "First Contentful Paint":
			if (timeInMs <= 1800) return Rating.Good;
			if (timeInMs <= 3000) return Rating.NeedsWork;
			return Rating.Poor;

		case "Largest Contentful Paint":
			if (timeInMs <= 2500) return Rating.Good;
			if (timeInMs <= 4000) return Rating.NeedsWork;
			return Rating.Poor;

		case "Speed Index":
			if (timeInMs <= 3400) return Rating.Good;
			if (timeInMs <= 5800) return Rating.NeedsWork;
			return Rating.Poor;

		case "Total Blocking Time":
			if (timeInMs <= 200) return Rating.Good;
			if (timeInMs <= 600) return Rating.NeedsWork;
			return Rating.Poor;

		case "Time to Interactive":
			if (timeInMs <= 3800) return Rating.Good;
			if (timeInMs <= 7300) return Rating.NeedsWork;
			return Rating.Poor;

		default:
			return Rating.Poor;
	}
};

const getBadgeClasses = (rating: Rating) => {
	switch (rating) {
		case Rating.Good:
			return "bg-green-600/20 text-green-400 border-green-600/30";
		case Rating.NeedsWork:
			return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
		case Rating.Poor:
			return "bg-red-600/20 text-red-400 border-red-600/30";
		default:
			return "bg-gray-600/20 text-gray-400 border-gray-600/30";
	}
};

const informativeLinks = {
	"First Contentful Paint (Category)":
		"https://web.dev/first-contentful-paint/",
	"Interaction to Next Paint (Category)": "https://web.dev/inp/",
	"First Contentful Paint": "https://web.dev/first-contentful-paint/",
	"Speed Index": "https://web.dev/speed-index/",
	"Largest Contentful Paint": "https://web.dev/lcp/",
	"Total Blocking Time": "https://web.dev/tbt/",
	"Time to Interactive": "https://web.dev/tti/",
	Performance: "https://web.dev/performance-scoring/",
	Accessibility: "https://web.dev/accessibility-scoring/",
	"Best Practices": "https://web.dev/lighthouse-best-practices/",
	SEO: "https://web.dev/lighthouse-seo/",
};

// Validates a URL and returns validation result with normalized URL
export const validateURL = (
	url: string
): {
	isValid: boolean;
	error?: string;
	normalizedUrl?: string;
} => {
	if (!url.trim()) {
		return { isValid: false, error: "Please enter a URL" };
	}

	// Add protocol if missing
	let normalizedUrl = url.trim();
	if (
		!normalizedUrl.startsWith("http://") &&
		!normalizedUrl.startsWith("https://")
	) {
		normalizedUrl = "https://" + normalizedUrl;
	}

	try {
		const urlObj = new URL(normalizedUrl);

		// Check if it has a valid domain
		if (!urlObj.hostname || urlObj.hostname.length < 3) {
			return { isValid: false, error: "Please enter a valid domain" };
		}

		// Check if domain has at least one dot (basic domain validation)
		if (!urlObj.hostname.includes(".")) {
			return {
				isValid: false,
				error: "Please enter a valid domain (e.g., example.com)",
			};
		}

		return { isValid: true, normalizedUrl };
	} catch {
		return { isValid: false, error: "Please enter a valid URL" };
	}
};

// Normalizes a URL by adding protocol if missing
export const normalizeURL = (url: string): string => {
	const trimmed = url.trim();
	if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
		return "https://" + trimmed;
	}
	return trimmed;
};

export const isValidURL = (url: string): boolean => {
	return validateURL(url).isValid;
};

export {
	ratePerformanceScore,
	rateUXCategory,
	rateTimeBasedMetric,
	getBadgeClasses,
	informativeLinks,
};
