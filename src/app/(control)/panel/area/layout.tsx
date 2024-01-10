import { Suspense } from "react";

import Organization from "../_components/organization/organization";
import { CardSkeleton } from "@/components/skeletons/card";
import { ActiveArea } from "../_components/active-area";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<main className="[grid-area:main] flex flex-col">{children}</main>

			<aside className="[grid-area:aside] min-h-screen overflow-y-auto overflow-x-hidden">
				<Organization />
				<Suspense fallback={<CardSkeleton />}>
					<ActiveArea />
				</Suspense>
			</aside>
		</>
	);
}
