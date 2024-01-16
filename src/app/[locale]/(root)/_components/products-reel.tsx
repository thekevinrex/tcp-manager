import { ShoppingBasket } from "lucide-react";

import { Reel } from "@/components/reel";

import { ProductsWithPrices } from "@/lib/types";
import { ProductReelItem } from "@/components/page/product-reel-item";

type Props = {
	more?: { href: string; label: string };
	title: string;
	products: ProductsWithPrices[];
};

export function ProductsReel({ more, title, products }: Props) {
	return (
		<Reel
			title={
				<>
					<ShoppingBasket className="w-8 h-8" /> {title}
				</>
			}
			more={more}
		>
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{products.map((products) => {
					return <ProductReelItem key={products.id} {...products} />;
				})}
			</div>
		</Reel>
	);
}
