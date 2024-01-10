import { getAllProductsWithPrices } from "@/fetchs/products";
import { getActiveArea } from "@/fetchs/sell-area";
import { redirect } from "next/navigation";
import { CreateSellArea } from "../_components/create-area";
import { FetchFailedError } from "@/components/error/FetchFailed";

export default async function AreaCreate() {
	const response = await getActiveArea();

	if (response.data) {
		redirect("/panel/sell-area");
	}

	const productsResponse = await getAllProductsWithPrices();

	if (productsResponse.error || !productsResponse.data) {
		return <FetchFailedError error={productsResponse.error} />;
	}

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					Create sell area
				</h1>

				<p>
					Create a sell area to be able to sell the products that you set in the
					sell area
				</p>
			</header>

			<CreateSellArea products={productsResponse.data} />
		</section>
	);
}
