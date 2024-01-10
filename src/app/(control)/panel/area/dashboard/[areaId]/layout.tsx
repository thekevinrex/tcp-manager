import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs";

import db from "@/lib/db";

import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { AreaNavbar } from "./_components/area-navbar";

export default async function AreaLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		areaId: string;
	};
}) {
	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					Sell area Info
				</h1>

				<p>Al the info related to the sell area, sells and stadistics</p>

				<div>
					<AreaNavbar area={params.areaId} />
				</div>
			</header>

			{children}
		</section>
	);
}
