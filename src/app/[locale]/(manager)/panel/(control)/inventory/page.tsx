import { Metadata } from "next";
import { Suspense } from "react";
import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { Filter } from "@/components/filter";
import { CardSkeleton } from "@/components/skeletons/card";

import { Organization } from "../_components/organization/organization";
import { AddInventory } from "./add-inventory";
import { ListInventories } from "./list-inventories";
import { CardListSkeleton } from "@/components/skeletons/card-list";
import { InventoriesStats } from "./inventories-stats";

export const metadata: Metadata = {
	title: "Inventory Information",
};

export default function Inventory({
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

	const _ = useTranslations("inventories");
	const messages = useMessages();

	const currentPage = Number(searchParams?.page) || 1;
	const query = searchParams?.q || "";
	const max = Number(searchParams?.max) || 5;

	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-4xl font-extrabold tracking-tight">
							{_("inventory")}
						</h1>

						<p>{_("inventory_des")}</p>

						<Suspense fallback={<CardListSkeleton />}>
							<InventoriesStats />
						</Suspense>

						<Filter name={_("search")} />
					</header>

					<Suspense
						key={query + currentPage + max}
						fallback={<DataTableSkeleton />}
					>
						<ListInventories query={query} max={max} page={currentPage} />
					</Suspense>
				</section>
			</main>

			<aside className="[grid-area:aside]">
				<Suspense fallback={<CardSkeleton />}>
					<AddInventory />
				</Suspense>

				<NextIntlClientProvider
					messages={{ organization: messages.organization }}
				>
					<Organization />
				</NextIntlClientProvider>
			</aside>
		</>
	);
}
