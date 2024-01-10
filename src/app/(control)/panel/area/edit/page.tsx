import { fetchAllProducts, getAllProductsWithPrices } from "@/fetchs/products";
import { getActiveArea, getAreaProducts } from "@/fetchs/sell-area";
import { redirect } from "next/navigation";
import { CreateSellArea } from "../_components/create-area";
import { FetchFailedError } from "@/components/error/FetchFailed";

export default async function AreaEdit({
	params,
}: {
	params: {
		areaId: string;
	};
}) {
	const response = await getActiveArea();

	if (!response.data) {
		redirect("/panel/area/create");
	}

	const areaProducts = await getAreaProducts(response.data);

	const productsResponse = await getAllProductsWithPrices();

	if (productsResponse.error || !productsResponse.data || areaProducts.error) {
		return <FetchFailedError error={productsResponse.error} />;
	}

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					Edit sell area
				</h1>

				<p>
					Edit the sell area, to add new products or delete from the sell area,
					also you can update the total of each product to sell
				</p>
			</header>

			<CreateSellArea
				area={response.data}
				areaProducts={areaProducts?.data || []}
				products={productsResponse.data}
			/>
		</section>
	);
}
