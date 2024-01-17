import { Badge } from "@/components/ui/badge";
import { ProductsWithPrices } from "@/lib/types";
import { AlignJustify } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProductDraggableDetails({
	areaProduct,
	added,
}: {
	areaProduct: ProductsWithPrices;
	added?: number;
}) {
	const _ = useTranslations("areas");
	const { name, aviable } = areaProduct;

	return (
		<div className="flex justify-between items-center shrink-0 sm:min-w-[200px] md:min-w-[350px] p-2 pb-0 pt-3 p sm:p-4">
			<div className="flex gap-x-3 items-center">
				<AlignJustify className="hidden md:inline-flex" />
				<h3 className="text-sm md:text-lg font-bold text-pretty tracking-wide">
					{name}
				</h3>
				<Badge variant={"green"}>{_("aviable", { aviable })}</Badge>
			</div>

			{added !== undefined && <Badge variant={"secondary"}>{added}</Badge>}
		</div>
	);
}
