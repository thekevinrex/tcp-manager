import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SupabaseImage } from "@/components/Image";

import { ProductsWithPricesAndOrg } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductDetails({
	product,
	reverse = false,
}: {
	product: ProductsWithPricesAndOrg;
	reverse?: boolean;
}) {
	const _ = useTranslations("home");

	const badge = () => {
		if (product.aviable <= 0 || product.status === "out_stock") {
			return <Badge variant={"destructive"}>{_("out_stock")}</Badge>;
		}

		return <Badge variant={"green"}>{_("aviable")}</Badge>;
	};

	return (
		<section className="pt-8 pb-5 flex flex-col max-md:items-center md:flex-row gap-4">
			<div className="relative w-[300px] flex mb-6 h-[300px] overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%] flex-col shrink-0">
				<SupabaseImage src={product.image} alt={product.name} />
				<div className="mask absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,0.2)]"></div>
			</div>

			<div className="w-full flex flex-col px-2">
				<h2 className="text-xl md:text-3xl lg:text-5xl font-semibold tracking-wide">
					{product.name}
				</h2>
				<p className="max-w-prose tracking-wide text-muted-foreground mb-3">
					{product.description}
				</p>

				<div className="flex items-center">{badge()}</div>

				<Separator className="my-3" />

				<div className="flex flex-col space-y-3">
					<span className="txt-sm font-semibold">
						{product?.prices.length > 0 ? _("prices") : _("price")}
					</span>

					<div className="text-2xl font-bold text-green-600">
						{formatCurrency(product.price)}
					</div>

					<div className="">
						{product.prices?.map(({ id, cant, value }) => {
							return (
								<span key={id} className="text-sm text-muted-foreground">
									{cant} {">"} {formatCurrency(value)}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
