import { Suspense } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Filter from "@/components/filter";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { AreaSellAll } from "./area-sells";
import db from "@/lib/db";
import { getArea } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function AreaSells({
	params,
	searchParams,
}: {
	params: {
		areaId: string;
		locale: string;
	};
	searchParams: {
		q?: string;
		page?: number;
		max?: number;
	};
}) {
	unstable_setRequestLocale(params.locale);

	const areaResponse = await getArea(Number(params.areaId));

	if (areaResponse.error || !areaResponse.data) {
		return <FetchFailedError error={areaResponse.error} />;
	}

	const currentPage = Number(searchParams.page) || 1;
	const query = searchParams.q || "";
	const max = Number(searchParams.max) || 10;

	const _ = await getTranslations("areas");

	return (
		<div className="flex flex-col space-y-5">
			<Filter name={_("sell_search")} />

			<Suspense
				key={query + currentPage + max}
				fallback={<DataTableSkeleton />}
			>
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
