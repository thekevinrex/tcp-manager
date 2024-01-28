import { useTranslations } from "next-intl";

import Link from "@/components/link";
import { Badge } from "@/components/ui/badge";
import { SupabaseImage } from "@/components/Image";

import { ProductsWithPrices } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const ProductReelItem = ({
	status,
	name,
	id,
	price,
	image,
	prices,
	aviable,
}: ProductsWithPrices) => {
	const _ = useTranslations("home");

	const badge = () => {
		if (aviable <= 0 || status === "out_stock") {
			return <Badge variant={"destructive"}>{_("out_stock")}</Badge>;
		}

		return <Badge variant={"green"}>{_("aviable")}</Badge>;
	};

	return (
		<div className="mb-8 lg:mb-0 space-y-3 flex flex-col items-center">
			<div className="w-full max-w-sm items-center flex flex-col">
				<div className="relative w-full flex mb-6 max-w-[300px] h-[200px] overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%]">
					<SupabaseImage src={image} alt={name} />
					<Link href={`/products/${id}`}>
						<div className="mask absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,0.2)]"></div>
					</Link>
				</div>
				<div className="flex flex-col items-start w-full">
					<h5 className="mb-4 text-lg font-bold">{name}</h5>

					<div className="flex mb-4">{badge()}</div>

					<div className="mb-4 flex  text-sm font-medium text-green-700 text-danger-500">
						{formatCurrency(price)}
					</div>
					<div className="">
						{prices?.map(({ id, cant, value }) => {
							return (
								<span key={id} className="text-sm text-muted-foreground">
									{cant} {">"} {formatCurrency(value)}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
