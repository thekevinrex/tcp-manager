import { Metadata } from "next";
import { Suspense } from "react";

import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { Filter } from "@/components/filter";
import { CardSkeleton } from "@/components/skeletons/card";

import { Organization } from "../_components/organization/organization";
import { AddInventory } from "./add-inventory";
import { ListInventories } from "./list-inventories";

export const metadata: Metadata = {
	title: "Inventory Information",
};

export default function Inventory({
	searchParams,
}: {
	searchParams?: {
		q?: string;
		page?: number;
	};
}) {
	const currentPage = Number(searchParams?.page) || 1;
	const query = searchParams?.q || "";

	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-4xl font-extrabold tracking-tight">
							Inventory
						</h1>

						<p>The list of all the added inventories in the last mounth</p>

						<Filter name="Search inventories by product" />
					</header>

					<Suspense key={query + currentPage} fallback={<DataTableSkeleton />}>
						<ListInventories query={query} page={currentPage} />
					</Suspense>
				</section>
			</main>

			<aside className="[grid-area:aside] h-auto lg:min-h-screen overflow-y-auto overflow-x-hidden">
				<Organization />

				<Suspense fallback={<CardSkeleton />}>
					<AddInventory />
				</Suspense>
			</aside>
		</>
	);
}
