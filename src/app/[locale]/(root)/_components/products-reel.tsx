import { SupabaseImage } from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductsWithPrices } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
	more?: { href: string; label: string };
	title: string;
	products: ProductsWithPrices[];
};

export function ProductsReel({ more, title, products }: Props) {
	return (
		<section className="mb-32 text-center lg:text-left">
			<div className="flex justify-between items-center mb-12">
				<h2 className="text-3xl font-bold flex gap-x-2 items-center">
					<ShoppingBasket className="w-8 h-8" />
					{title}
				</h2>

				{more && (
					<div className="flex items-center shrink-0">
						<Button variant={"outline"}>
							<Link href={more.href} className="flex items-center gap-x-2">
								<span>{more.label}</span>
								<ArrowRight />
							</Link>
						</Button>
					</div>
				)}
			</div>

			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{products.map((products) => {
					return <ReelItem key={products.id} {...products} />;
				})}
			</div>
		</section>
	);
}

const ReelItem = ({
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
		<div className="mb-12 lg:mb-0">
			<div className="relative mb-6 h-[200px] overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%]">
				<Link href={`/products/${id}`}>
					<SupabaseImage width={300} height={200} src={image} alt={name} />
					<div className="mask absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,0.2)]"></div>
				</Link>
			</div>
			<h5 className="mb-4 text-lg font-bold">{name}</h5>

			<div className="flex items-center">{badge()}</div>

			<div className="mb-4 flex items-center justify-center text-sm font-medium text-green-700 text-danger-500 lg:justify-start">
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
	);
};
