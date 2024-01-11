import { Metadata } from "next";
import { Suspense } from "react";

import { CreateProduct } from "./create-product";
import { ListProducts } from "./list-products";

import { Filter } from "@/components/filter";
import { DataTableSkeleton } from "@/components/skeletons/data-table";

import { Organization } from "../_components/organization/organization";

export const metadata: Metadata = {
	title: "List of products",
};

function Products({
	searchParams,
}: {
	searchParams?: {
		q?: string;
		page?: number;
		max?: number;
	};
}) {
	const currentPage = Number(searchParams?.page) || 1;
	const query = searchParams?.q || "";
	const max = Number(searchParams?.max) || 5;

	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-4xl font-extrabold tracking-tight">
							List of products
						</h1>

						<p>The list of all the products aviable</p>

						<Filter name="Search products..." />
					</header>

					<Suspense
						key={query + currentPage + max}
						fallback={<DataTableSkeleton />}
					>
						<ListProducts max={max} query={query} page={currentPage} />
					</Suspense>
				</section>
			</main>

			<aside className="[grid-area:aside]">
				<CreateProduct />
				<Organization />
			</aside>
		</>
	);
}

export default Products;
