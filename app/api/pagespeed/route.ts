import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const url = searchParams.get("url");

		if (!url) {
			return NextResponse.json(
				{ error: "No URL provided" },
				{ status: 400 }
			);
		}

		const res = await fetch(
			`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
				url
			)}&category=performance&category=accessibility&category=best-practices&category=seo&key=${
				process.env.PAGESPEED_API_KEY
			}`
		);
		if (!res.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch from Google" },
				{ status: res.status }
			);
		}
		const data = await res.json();
		return NextResponse.json(data);
	} catch (err) {
		console.log(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
