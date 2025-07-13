export interface PageSpeedModel {
	captchaResult: string;
	kind: "pagespeedonline#result";
	id: string;
	loadingExperience: {
		id: string;
		metrics: Record<
			string,
			{
				percentile: number;
				distributions: {
					min: number;
					max: number;
					proportion: number;
				}[];
				category: string;
			}
		>;
		overall_category: string;
		initial_url: string;
	};
	originLoadingExperience: {
		id: string;
		metrics: Record<
			string,
			{
				percentile: number;
				distributions: {
					min: number;
					max: number;
					proportion: number;
				}[];
				category: string;
			}
		>;
		overall_category: string;
		initial_url: string;
	};
	lighthouseResult: {
		requestedUrl: string;
		finalUrl: string;
		lighthouseVersion: string;
		userAgent: string;
		fetchTime: string;
		environment: {
			networkUserAgent: string;
			hostUserAgent: string;
			benchmarkIndex: number;
		};
		runWarnings: unknown[];
		configSettings: {
			emulatedFormFactor: string;
			locale: string;
			onlyCategories: unknown;
		};
		audits: Record<
			string,
			{
				id: string;
				title: string;
				description?: string;
				score: number | null;
				scoreDisplayMode: string;
				displayValue?: string;
				explanation?: string;
				errorMessage?: string;
				warnings?: unknown;
				details?: Record<string, unknown>;
			}
		>;
		categories: Record<
			string,
			{
				id: string;
				title: string;
				description?: string;
				score: number | null;
				manualDescription?: string;
				auditRefs: {
					id: string;
					weight: number;
					group?: string;
				}[];
			}
		>;
		categoryGroups: Record<
			string,
			{
				title: string;
				description: string;
			}
		>;
		runtimeError?: {
			code: string;
			message: string;
		};
		timing: {
			total: number;
		};
		i18n: {
			rendererFormattedStrings: {
				varianceDisclaimer: string;
				opportunityResourceColumnLabel: string;
				opportunitySavingsColumnLabel: string;
				errorMissingAuditInfo: string;
				errorLabel: string;
				warningHeader: string;
				auditGroupExpandTooltip: string;
				passedAuditsGroupTitle: string;
				notApplicableAuditsGroupTitle: string;
				manualAuditsGroupTitle: string;
				toplevelWarningsMessage: string;
				scorescaleLabel: string;
				crcLongestDurationLabel: string;
				crcInitialNavigation: string;
				lsPerformanceCategoryDescription: string;
				labDataTitle: string;
			};
		};
	};
	analysisUTCTimestamp: string;
	version: {
		major: number;
		minor: number;
	};
}
