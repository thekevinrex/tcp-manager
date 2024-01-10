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
							List of products
						</h1>

						<p>The list of all the products aviable</p>

						<Filter name="Search products..." />
					</header>

					<Suspense key={query + currentPage} fallback={<DataTableSkeleton />}>
						<ListProducts query={query} page={currentPage} />
					</Suspense>
				</section>
			</main>

			<aside className="[grid-area:aside] h-auto lg:min-h-screen sticky top-0 overflow-y-auto overflow-x-hidden">
				<Organization />
				<CreateProduct />
			</aside>
		</>
	);
}

export default Products;
