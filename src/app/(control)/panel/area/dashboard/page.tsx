import { Suspense } from "react";

import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { SellAreas } from "./sell-areas";

export default function AreaDashboard() {
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

			<Suspense fallback={<DataTableSkeleton />}>
				<SellAreas />
			</Suspense>
		</section>
	);
}
