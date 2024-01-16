import { CarouselReel } from "@/components/carousel";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { ProductReelItem } from "@/components/page/product-reel-item";
import { Reel } from "@/components/reel";
import { CarouselItem } from "@/components/ui/carousel";

import { getTopProducts } from "@/fetchs/shop/products";
import { ShoppingBasket } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TopProductsSlider({
	max = 8,
	not,
}: {
	max?: number;
	not?: number;
}) {
	const response = await getTopProducts(max, not);
	const _ = await getTranslations("home");

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<Reel
			title={
				<>
					<ShoppingBasket className="w-8 h-8" /> {_("top_products")}
				</>
			}
		>
			<CarouselReel>
				{response.data.map((item) => {
					return (
						<CarouselItem
							key={item.id}
							className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
						>
							<ProductReelItem {...item} />
						</CarouselItem>
					);
				})}
			</CarouselReel>
		</Reel>
	);
}
