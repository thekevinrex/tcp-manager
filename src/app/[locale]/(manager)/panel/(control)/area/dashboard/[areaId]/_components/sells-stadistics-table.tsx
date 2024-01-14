"use client";

import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SellWithProductAndInventories, StaticProductSells } from "@/lib/types";
import { calcStadisticsSell, formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export function SellsStadisticsTable({
	sells,
}: {
	sells: SellWithProductAndInventories[];
}) {
	const _ = useTranslations("areas");

	const [StadisticsProducts, setStadisticsProducts] = useState<
		StaticProductSells[]
	>([]);
	const [search, setSearch] = useState<string>("");
	const [showProducts, setShowProducts] = useState<StaticProductSells[]>([]);

	useMemo(() => {
		const products: StaticProductSells[] = [];

		for (const sell of sells) {
			const product = products.find((p) => p.id === sell.productId);

			const stats = calcStadisticsSell(sell);

			if (product) {
				product.earned += stats.earend;
				product.sells += stats.cant;
				product.total += stats.total;
			} else {
				products.push({
					name: sell.Product.name,
					id: sell.Product.id,

					earned: stats.earend,
					sells: stats.cant,
					total: stats.total,
				});
			}
		}

		setStadisticsProducts([...products]);
	}, [sells]);

	useEffect(() => {
		const regex = new RegExp(`${search}`, "i");

		setShowProducts(
			StadisticsProducts.filter((apro) => {
				return regex.test(apro.name);
			})
		);
	}, [StadisticsProducts, search]);

	return (
		<div className="flex flex-col space-y-6">
			<div className="flex">
				<Input
					placeholder={_("sell_area_search")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="w-full rounded-md border my-6">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{_("product")}</TableHead>
							<TableHead>{_("sells")}</TableHead>
							<TableHead>{_("total")}</TableHead>
							<TableHead>{_("earned")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{showProducts && showProducts.length > 0 ? (
							showProducts.map((product) => {
								return (
									<TableRow key={product.id}>
										<TableCell>
											<span className="text-lg font-semibold">
												{product.name}
											</span>
										</TableCell>
										<TableCell>
											<span className="text-green-500 text-xl font-bold tracking-widest text-balance">
												{product.sells}
											</span>
										</TableCell>
										<TableCell>
											<span className="text-green-500 text-xl font-bold tracking-widest text-balance">
												{formatCurrency(product.total)}
											</span>
										</TableCell>
										<TableCell>
											<span className="text-green-500 text-xl font-bold tracking-widest text-balance">
												{formatCurrency(product.earned)}
											</span>
										</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center">
									{_("sell_area_search_no_results")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
