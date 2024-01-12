import { getActiveArea } from "@/fetchs/sell-area";
import { getAllProductsWithPrices } from "@/fetchs/products";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { SellArea } from "./sell-area";
import { CreateArea } from "../area/_components/create-area";

export default async function Page() {
	const areaResponse = await getActiveArea();

	if (areaResponse.error) {
		return (
			<ErrorLayout>
				<FetchFailedError error={areaResponse.error} />
			</ErrorLayout>
		);
	}

	if (!areaResponse.data) {
		return (
			<ErrorLayout>
				<div className="h-full flex justify-center items-center space-y-5 flex-col min-h-[450px]">
					<h2 className="text-2xl font-bold tracking-widest uppercase text-pretty">
						Area no created
					</h2>

					<p>To be able to sells products create a sell area</p>

					<CreateArea />
				</div>
			</ErrorLayout>
		);
	}

	const areaProducts = await getAllProductsWithPrices();

	if (areaProducts.error) {
		return (
			<ErrorLayout>
				<FetchFailedError error={areaProducts.error} />
			</ErrorLayout>
		);
	}

	return (
		<SellArea
			area={areaResponse.data}
			areaProducts={areaProducts?.data || []}
		/>
	);
}

const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<main className="[grid-area:main] flex flex-col">{children}</main>
			<aside className="[grid-area:aside]"></aside>
		</>
	);
};
