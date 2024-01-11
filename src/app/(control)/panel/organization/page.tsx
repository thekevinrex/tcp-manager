import { Suspense } from "react";
import { ActiveArea } from "../_components/active-area";
import { CardSkeleton } from "@/components/skeletons/card";
import { OrganizationPublic } from "./organization-public";
import Organization from "../_components/organization/organization";

export default function OrganizationPage() {
	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-4xl font-extrabold tracking-tight">
							Organization
						</h1>

						<p>Edit the public settings of your organization</p>
					</header>

					<Suspense fallback={"loading..."}>
						<OrganizationPublic />
					</Suspense>
				</section>
			</main>

			<aside className="[grid-area:aside]">
				<Suspense fallback={<CardSkeleton />}>
					<ActiveArea />
				</Suspense>
				<Organization />
			</aside>
		</>
	);
}
