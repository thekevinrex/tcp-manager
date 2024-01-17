import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { PaginationComponent } from "@/components/pagination";
import { fetchAllProducts } from "@/fetchs/products";

import { DataProducts } from "./_components/product-table";

export async function ListProducts({
	query,
	page,
	max = 5,
}: {
	query: string;
	page: number;
	max?: number;
}) {
	const response = await fetchAllProducts({ query, page, max });
	const messages = await getMessages();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<NextIntlClientProvider
			messages={{
				products: messages.products,
				alert: messages.alert,
				pagination: messages.pagination,
			}}
		>
			<div className="flex flex-col space-y-5">
				<DataProducts products={response.data} />
				<PaginationComponent
					page={page}
					max={max}
					total={response?.total || 0}
				/>
			</div>
		</NextIntlClientProvider>
	);
}

export default ListProducts;
