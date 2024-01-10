import { Suspense } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Filter from "@/components/filter";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { AreaSellAll } from "./area-sells";
import db from "@/lib/db";
import { getArea } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";

export default async function AreaSells({
	params,
	searchParams,
}: {
	params: {
		areaId: string;
	};
	searchParams: {
		q?: string;
		page?: number;
	};
}) {
	const { orgId } = auth();

	if (!orgId) {
		redirect("/panel/area/dashboard");
	}

	const areaResponse = await getArea(Number(params.areaId));

	if (areaResponse.error || !areaResponse.data) {
		return <FetchFailedError error={areaResponse.error} />;
	}

	const currentPage = Number(searchParams.page) || 1;
	const query = searchParams.q || "";
	const max = 10;

	return (
		<div className="flex flex-col space-y-5">
			<Filter name="search sells per product..." />

			<Suspense key={query + currentPage} fallback={<DataTableSkeleton />}>
				<AreaSellAll
					area={areaResponse.data}
					query={query}
					max={max}
					page={currentPage}
				/>
			</Suspense>
		</div>
	);
}
