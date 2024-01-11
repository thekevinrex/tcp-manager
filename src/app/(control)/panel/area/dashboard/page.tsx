import { Suspense } from "react";

import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { SellAreas } from "./sell-areas";

export default function AreaDashboard({
	searchParams,
}: {
	searchParams: {
		page?: number;
		max?: number;
	};
}) {
	const page = Number(searchParams.page) || 1;
	const max = Number(searchParams.max) || 10;

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					Sell area dashboard
				</h1>

				<p>
					Edit the sell area, to add new products or delete from the sell area,
					also you can update the total of each product to sell
				</p>
			</header>

			<Suspense key={page + max} fallback={<DataTableSkeleton />}>
				<SellAreas max={max} page={page} />
			</Suspense>
		</section>
	);
}
