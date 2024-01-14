import { FetchFailedError } from "@/components/error/FetchFailed";
import { ReelSkeleton } from "@/components/skeletons/reel";
import { getTopProducts } from "@/fetchs/shop/products";
import { ProductsReel } from "./_components/products-reel";
import { getTranslations } from "next-intl/server";

export async function TopProducts() {
	const response = await getTopProducts();
	const _ = await getTranslations();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<ProductsReel
			title={_("top_products")}
			more={{ href: "/products", label: _("see_more") }}
			products={response.data}
		/>
	);
}
