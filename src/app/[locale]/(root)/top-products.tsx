import { FetchFailedError } from "@/components/error/FetchFailed";
import { ReelSkeleton } from "@/components/skeletons/reel";
import { getTopProducts } from "@/fetchs/shop/products";
import { ProductsReel } from "./_components/products-reel";
import { getTranslations } from "next-intl/server";

export async function TopProducts({
	max = 8,
	more = true,
}: {
	max?: number;
	more?: boolean;
}) {
	const response = await getTopProducts(max);
	const _ = await getTranslations("home");

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<ProductsReel
			title={_("top_products")}
			more={more ? { href: "/products", label: _("see_more") } : undefined}
			products={response.data}
		/>
	);
}
