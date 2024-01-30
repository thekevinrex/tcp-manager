"use client";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Error(
	error: Error & { digest?: string },
	reset: () => void
) {
	console.log(reset);
	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<FetchFailedError error={"error page"} />

				{reset && (
					<div className="w-full flex justify-center">
						<Button variant={"secondary"} onClick={reset}>
							<RefreshCcw /> Refresh
						</Button>
					</div>
				)}
			</main>
			<aside className="[grid-area:aside] w-0"></aside>
		</>
	);
}
