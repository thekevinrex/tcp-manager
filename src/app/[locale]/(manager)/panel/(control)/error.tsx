"use client";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Error(
	error: Error & { digest?: string },
	reset: () => void
) {
	console.error(error);
	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<FetchFailedError error={"error page"} />

				{reset && (
					<Button variant={"secondary"} onClick={() => reset()}>
						<RefreshCcw />
					</Button>
				)}
			</main>
			<aside className="[grid-area:aside] w-0"></aside>
		</>
	);
}
