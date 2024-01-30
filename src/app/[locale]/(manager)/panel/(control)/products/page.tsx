import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Protect } from "@clerk/nextjs";

import { ListProducts } from "./list-products";

import { Filter } from "@/components/filter";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { CardListSkeleton } from "@/components/skeletons/card-list";
import { ProductsStats } from "./products-stats";
import { NoPermission } from "@/components/page/no-permission";

export async function generateMetadata({
	params: { locale },
}: {
	params: { locale: string };
}) {
	const t = await getTranslations({ locale, namespace: "header" });

	return {
		title: t("products"),
	};
}

function Products({
	searchParams,
	params: { locale },
}: {
	searchParams?: {
		q?: string;
		page?: number;
		max?: number;
	};
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("products");

	const currentPage = Number(searchParams?.page) || 1;
	const query = searchParams?.q || "";
	const max = Number(searchParams?.max) || 5;

	return (
		<main className="[grid-area:main] flex flex-col">
			<Protect permission="org:products:read" fallback={<NoPermission />}>
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-4xl font-extrabold tracking-tight">
							{_("product_list")}
						</h1>

						<p>{_("product_list_des")}</p>

						<Suspense fallback={<CardListSkeleton />}>
							<ProductsStats />
						</Suspense>

						<Filter name={_("search")} />
					</header>

					<Suspense
						key={query + currentPage + max}
						fallback={<DataTableSkeleton />}
					>
						<ListProducts max={max} query={query} page={currentPage} />
					</Suspense>
				</section>
			</Protect>
		</main>
	);
}

export default Products;
