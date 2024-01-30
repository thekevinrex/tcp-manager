"use client";

import { Barcode, CreditCard, ShoppingBasket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link as ScrollLink } from "react-scroll";

export function ScrollLinks() {
	const _ = useTranslations("products");

	return (
		<>
			<ScrollLink
				to="product-stats"
				spy={true}
				offset={-70}
				smooth={true}
				className="size-10 rounded-md border flex items-center justify-center cursor-pointer"
			>
				<ShoppingBasket />
				<span className="sr-only">{_("product_stats")}</span>
			</ScrollLink>

			<ScrollLink
				to="sells-stats"
				spy={true}
				offset={-70}
				smooth={true}
				className="size-10 rounded-md border flex items-center justify-center cursor-pointer"
			>
				<CreditCard />
				<span className="sr-only">{_("sells_stats")}</span>
			</ScrollLink>

			<ScrollLink
				to="inventories-stats"
				spy={true}
				offset={-70}
				smooth={true}
				className="size-10 rounded-md border flex items-center justify-center cursor-pointer"
			>
				<Barcode />
				<span className="sr-only">{_("inventories_stats")}</span>
			</ScrollLink>
		</>
	);
}
