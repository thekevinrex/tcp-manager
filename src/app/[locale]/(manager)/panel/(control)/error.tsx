"use client";

import { FetchFailedError } from "@/components/error/FetchFailed";

export default function Error(
	error: Error & { digest?: string },
	reset: () => void
) {
	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<FetchFailedError error={"error page"} reset={reset} />
			</main>
			<aside className="[grid-area:aside] w-0"></aside>
		</>
	);
}
