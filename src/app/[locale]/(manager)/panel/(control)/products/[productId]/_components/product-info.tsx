import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProductsWithAll } from "@/lib/types";
import { EditButton } from "../../_components/edit-product";
import { DeleteProduct } from "../_components/delete-button";
import { formatCurrency } from "@/lib/utils";
import { SupabaseImage } from "@/components/Image";
import { ScrollLinks } from "./scroll-link";

export function ProductInfo({ product }: { product: ProductsWithAll }) {
	const _ = useTranslations("products");

	const { name, price, prices, id, aviable } = product;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{_("product")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-y-4">
					<div className="flex flex-col gap-y-1">
						<span className="text-xs">{_("product_name")}</span>
						<div className="text-lg font-semibold">{name}</div>
					</div>

					<div className="flex flex-col gap-y-1">
						<span className="text-xs">{_("product_price")}</span>
						<div className="text-lg font-semibold text-green-600">
							{formatCurrency(price)}
						</div>

						<div className="flex flex-col gap-y-1">
							{prices?.map(({ id, cant, value }) => {
								return (
									<span key={id} className="text-sm text-muted-foreground">
										{cant} {">"} {formatCurrency(value)}
									</span>
								);
							})}
						</div>
					</div>

					<div className="flex flex-col gap-y-1">
						<span className="text-xs">{_("aviable")}</span>
						<div className="text-lg font-semibold">{aviable}</div>
					</div>

					<div className="flex pt-4 gap-x-2">
						<EditButton product={product} />
						<DeleteProduct productId={id} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function ProductInfoRow({
	product,
	scrolls = false,
}: {
	product: ProductsWithAll;
	scrolls?: boolean;
}) {
	const messages = useMessages();
	const _ = useTranslations("products");
	const { name, prices, price, id } = product;

	return (
		<Card>
			<CardHeader className="flex flex-col sm:flex-row gap-3 items-start">
				<div className="w-32 h-24 relative overflow-hidden shrink-0">
					<SupabaseImage product={product} alt={name} />
				</div>

				<div className="flex flex-col gap-y-3 w-full">
					<CardTitle>{name}</CardTitle>

					<div className="flex flex-col gap-y-1">
						<span className="text-xs">{_("product_price")}</span>
						<div className="text-lg font-semibold text-green-600">
							{formatCurrency(price)}
						</div>

						<div className="flex flex-col gap-y-1">
							{prices?.map(({ id, cant, value }) => {
								return (
									<span key={id} className="text-sm text-muted-foreground">
										{cant} {">"} {formatCurrency(value)}
									</span>
								);
							})}
						</div>
					</div>

					<NextIntlClientProvider
						messages={{
							products: messages.products,
							alert: messages.alert,
							fieldsErrors: messages.fieldsErrors,
						}}
					>
						<div className="flex pt-4 gap-x-2">
							<EditButton product={product} />
							<DeleteProduct productId={id} />
						</div>
					</NextIntlClientProvider>
				</div>

				{scrolls && (
					<div className="hidden sm:flex shrink-0 flex-col justify-start items-center gap-3">
						<NextIntlClientProvider
							messages={{
								products: messages.products,
							}}
						>
							<ScrollLinks />
						</NextIntlClientProvider>
					</div>
				)}
			</CardHeader>
		</Card>
	);
}
