import { Metadata } from "next";
import { Suspense } from "react";
import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { CreateProduct } from "./create-product";
import { ListProducts } from "./list-products";

import { Filter } from "@/components/filter";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { Organization } from "../_components/organization/organization";
import { CardListSkeleton } from "@/components/skeletons/card-list";
import { ProductsStats } from "./products-stats";
import { Protect } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export const metadata: Metadata = {
	title: "List of products",
};

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
	const messages = useMessages();

	const currentPage = Number(searchParams?.page) || 1;
	const query = searchParams?.q || "";
	const max = Number(searchParams?.max) || 5;

	return (
		<>
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

			<aside className="[grid-area:aside]">
				<NextIntlClientProvider
					messages={{
						organization: messages.organization,
						products: messages.products,
					}}
				>
					<Protect permission="org:products:manage">
						<CreateProduct />
					</Protect>
					<Organization />
				</NextIntlClientProvider>
			</aside>
		</>
	);
}

export default Products;
