import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { SellAreas } from "./sell-areas";

export default function AreaDashboard({
	searchParams,
	params: { locale },
}: {
	searchParams: {
		page?: number;
		max?: number;
	};
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = useTranslations("areas");

	const page = Number(searchParams.page) || 1;
	const max = Number(searchParams.max) || 10;

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					{_("areas_dashboard")}
				</h1>

				<p>{_("areas_dashboard_des")}</p>
			</header>

			<Suspense key={page + max} fallback={<DataTableSkeleton />}>
				<SellAreas max={max} page={page} />
			</Suspense>
		</section>
	);
}
