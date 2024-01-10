import {
	getActiveArea,
	getAllAreaProducts,
	getAreaProducts,
} from "@/fetchs/sell-area";
import { SellArea } from "./sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { NoAreaCreated } from "./_components/no-area-created";

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
				<NoAreaCreated />
			</ErrorLayout>
		);
	}

	const areaProducts = await getAreaProducts(areaResponse.data);

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
			<aside className="[grid-area:aside] min-h-screen overflow-y-auto overflow-x-hidden"></aside>
		</>
	);
};
