import { CarouselReel } from "@/components/carousel";
import { FetchFailedError } from "@/components/error/FetchFailed";
import { OrganizationReelItem } from "@/components/page/organization-reel-item";
import { ProductReelItem } from "@/components/page/product-reel-item";
import { Reel } from "@/components/reel";
import { CarouselItem } from "@/components/ui/carousel";
import { getTopOrganizations } from "@/fetchs/shop/organizations";

import { Building2, ShoppingBasket } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TopOrganizationsSlider({
	max = 8,
	not,
}: {
	max?: number;
	not?: string;
}) {
	const response = await getTopOrganizations(max, not);
	const _ = await getTranslations("home");

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<Reel
			title={
				<>
					<Building2 className="w-8 h-8" /> {_("top_organizations")}
				</>
			}
		>
			<CarouselReel>
				{response.data.map((item) => {
					return (
						<CarouselItem
							key={item.org}
							className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
						>
							<OrganizationReelItem {...item} />
						</CarouselItem>
					);
				})}
			</CarouselReel>
		</Reel>
	);
}
