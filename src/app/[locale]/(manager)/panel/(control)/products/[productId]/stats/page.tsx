import {
	ChevronRight,
	CreditCard,
	DollarSign,
	Hash,
	TrendingDown,
	TrendingUp,
} from "lucide-react";

import { NextIntlClientProvider, useTranslations } from "next-intl";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { redirect } from "next/navigation";
import { useMemo } from "react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "@/components/link";
import { FetchFailedError } from "@/components/error/FetchFailed";

import { getProduct } from "@/fetchs/products";
import { ProductsWithAll, ProductsWithPrices } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

import { ProductStatItem } from "../_components/product-stat-item";
import { ProductInfoRow } from "../_components/product-info";

export default async function productStats({
	params: { locale, productId },
}: {
	params: { locale: string; productId: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = await getTranslations("products");
	const messages = await getMessages();

	const response = await getProduct(parseInt(productId));

	if (response.error) {
		return <FetchFailedError error={response.error} />;
	}

	if (!response.data) {
		redirect(`/${locale}/panel/products`);
	}

	const { id } = response.data;

	return (
		<div className="flex flex-col gap-y-8">
			<ProductInfoRow scrolls product={response.data} />

			<NextIntlClientProvider messages={{ products: messages.products }}>
				<ProductStats product={response.data} />

				<Separator />

				<SellsStats product={response.data} />

				<div>
					<Button variant={"outline"} asChild>
						<Link
							className="flex gap-x-2"
							href={`/${locale}/panel/products/${id}/sells`}
						>
							{_("see_all_sells")} <ChevronRight />
						</Link>
					</Button>
				</div>
				<Separator />

				<InventoryStats product={response.data} />

				<div>
					<Button variant={"outline"} asChild>
						<Link
							className="flex gap-x-2"
							href={`/${locale}/panel/products/${id}/inventories`}
						>
							{_("see_all_inventories")} <ChevronRight />
						</Link>
					</Button>
				</div>
			</NextIntlClientProvider>
		</div>
	);
}

const ProductStats = ({ product }: { product: ProductsWithPrices }) => {
	const _ = useTranslations("products");

	const stats = useMemo(() => {
		const { aviable, price, prices } = product;

		const stats = [
			{
				label: "aviable",
				value: aviable,
				icon: <Hash />,
			},
			{
				label: "total_can_earn",
				value: formatCurrency(price * aviable),
				icon: <TrendingUp />,
			},
			{
				label: "total_min_earn",
				icon: <TrendingDown />,
				value:
					prices.length > 0
						? prices.map((p) => {
								return (
									`${p.cant} > ` +
									(p.cant > aviable
										? formatCurrency(p.value * aviable)
										: formatCurrency(price * aviable))
								);
						  })
						: formatCurrency(price * aviable),
			},
		];

		return stats;
	}, [product]);

	return (
		<ProductStatItem
			id="product-stats"
			title={_("product_stats")}
			stats={stats}
		/>
	);
};

const InventoryStats = ({ product }: { product: ProductsWithAll }) => {
	const _ = useTranslations("products");

	const stats = useMemo(() => {
		const inventoriesStats = {
			cant: 0,
			sells: 0,
			actual: 0,
			inicial: 0,
		};

		// split the inventories by createdAt
		const limit = 30;

		const chartData: Array<{ name: number; cant: number }> = [];

		product.inventories.forEach((inventory) => {
			inventoriesStats.cant += inventory.cant;
			inventoriesStats.sells += inventory.selled;

			inventoriesStats.actual +=
				(inventory.cant - inventory.selled) * inventory.total;
			inventoriesStats.inicial += inventory.cant * inventory.total;

			const createdAt = new Date(inventory.createdAt).getTime();

			const index = chartData.findIndex((item) => {
				return item.name === createdAt;
			});

			if (index === -1) {
				chartData.push({
					name: createdAt,
					cant: inventory.cant,
				});
			} else {
				chartData[index].cant += inventory.cant;
			}
		});

		// fill the space bettween
		for (let i = 0; i < limit; i++) {
			const createdAt = new Date().getTime() - i * 24 * 60 * 60 * 1000;
			const index = chartData.findIndex((item) => {
				return item.name === createdAt;
			});
			if (index === -1) {
				chartData.push({
					name: createdAt,
					cant: 0,
				});
			}
		}

		chartData.sort((a, b) => {
			return a.name - b.name;
		});

		const stats = {
			chartData: {
				keys: [{ key: "cant", label: "entries", format: false }],
				data: chartData,
			},

			stats: [
				{
					label: "cant_inventories",
					icon: <Hash />,
					value: inventoriesStats.cant,
				},
				{
					label: "sell_inventories",
					icon: <CreditCard />,
					value: inventoriesStats.sells,
				},
				{
					label: "inversion_actual",
					icon: <DollarSign />,
					value: formatCurrency(inventoriesStats.actual),
				},
				{
					label: "inversion_inicial",
					icon: <TrendingUp />,
					value: formatCurrency(inventoriesStats.inicial),
				},
			],
		};

		return stats;
	}, [product]);

	return (
		<ProductStatItem
			id="inventories-stats"
			title={_("inventories_stats")}
			charData={stats.chartData}
			stats={stats.stats}
		/>
	);
};

const SellsStats = ({ product }: { product: ProductsWithAll }) => {
	const _ = useTranslations("products");

	const stats = useMemo(() => {
		const sellsStats = {
			cant: product.selleds.length,
			units: 0,
			total: 0,
			earns: 0,
		};

		// split the inventories by createdAt
		const limit = 30;

		const chartData: Array<{
			name: number;
			earns: number;
			total: number;
			cant: number;
		}> = [];

		product.selleds.forEach((sell) => {
			const createdAt = new Date(sell.selledAt).getTime();

			const index = chartData.findIndex((item) => {
				return item.name === createdAt;
			});

			const earns = sell.inventories.reduce((acc, i) => {
				return acc + i.cant * (sell.price - i.price);
			}, 0);

			sellsStats.units += sell.cant;
			sellsStats.total += sell.price * sell.cant;
			sellsStats.earns += earns;

			if (index === -1) {
				chartData.push({
					name: createdAt,
					earns,
					total: sell.cant * sell.price,
					cant: sell.cant,
				});
			} else {
				chartData[index].total += sell.price * sell.cant;
				chartData[index].earns += earns;
				chartData[index].cant += sell.cant;
			}
		});

		// fill the space bettween
		for (let i = 0; i < limit; i++) {
			const createdAt = new Date().getTime() - i * 24 * 60 * 60 * 1000;
			const index = chartData.findIndex((item) => {
				return item.name === createdAt;
			});
			if (index === -1) {
				chartData.push({
					name: createdAt,
					earns: 0,
					total: 0,
					cant: 0,
				});
			}
		}

		chartData.sort((a, b) => {
			return a.name - b.name;
		});

		const stats = {
			chartData: {
				keys: [
					{ key: "total", label: "total_sells" },
					{ key: "earns", label: "earns" },
					{ key: "cant", label: "units_sells", format: false },
				],
				data: chartData,
			},

			stats: [
				{
					label: "#_sells",
					icon: <Hash />,
					value: sellsStats.cant,
				},
				{
					label: "units_sells",
					icon: <CreditCard />,
					value: sellsStats.units,
				},
				{
					label: "total_sells",
					icon: <DollarSign />,
					value: formatCurrency(sellsStats.total),
				},
				{
					label: "total_earns",
					icon: <TrendingUp />,
					value: formatCurrency(sellsStats.earns),
				},
			],
		};

		return stats;
	}, [product]);

	return (
		<ProductStatItem
			id="sells-stats"
			title={_("sells_stats")}
			charData={stats.chartData}
			stats={stats.stats}
		/>
	);
};
