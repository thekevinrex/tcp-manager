import { useDroppable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { calcPriceBreakdown, cn, formatCurrency } from "@/lib/utils";
import { SellProductItem } from "./sell-product-item";

import Link from "@/components/link";
import { Calculator } from "@/components/calculator";
import { Badge } from "@/components/ui/badge";
import { MAX_SELECTEDS } from "@/config/site";
import { ProductsWithPrices } from "@/lib/types";
import { SelectedFn, SelectedType } from "../sell-area";

export function SellForm({
	over,
	selecteds,
	onUpdateSelected,
	areaProducts,
	loading,
	disabled,
	newSell,
}: {
	over: boolean;
	selecteds: SelectedType[];
	onUpdateSelected: SelectedFn;
	areaProducts: ProductsWithPrices[];
	loading: boolean;
	disabled: boolean;
	newSell: (selecteds: SelectedType[]) => void;
}) {
	const _ = useTranslations("sells");
	const uuid = useMemo(() => crypto.randomUUID(), []);

	const { setNodeRef } = useDroppable({
		id: "drop-product-" + uuid,
	});

	const [total, setTotal] = useState(0);

	// Calc sell price
	useEffect(() => {
		let posibleTotal = 0;
		for (const selected of selecteds) {
			const product = areaProducts.find((p) => p.id === selected.id);

			if (!product) continue;

			posibleTotal +=
				selected.price !== null
					? selected.price * selected.added
					: calcPriceBreakdown({
							total: selected.added,
							product,
					  }) * selected.added;
		}

		setTotal(posibleTotal);
	}, [selecteds, areaProducts]);

	const onSubmit = () => {
		newSell(selecteds);
	};

	return (
		<Card className="relative">
			<CardHeader>
				<CardTitle>{_("sell_box")}</CardTitle>
				<CardDescription>{_("sell_box_des")}</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-5">
				<div className="flex gap-x-3">
					<Calculator />
					<Button asChild type="button" variant={"secondary"}>
						<Link href={"/panel/sell-area/facture"}>{_("create_facture")}</Link>
					</Button>
				</div>

				<div
					ref={setNodeRef}
					className={cn([
						"flex flex-col w-full p-2 h-auto border-y relative",
						over ? "border-green-500" : "",
					])}
				>
					<div className="absolute -top-3 left-0 z-40">
						<Badge variant={"secondary"} className="h-6">
							{selecteds.length} / {MAX_SELECTEDS}
						</Badge>
					</div>

					{over && <div className="inset-0 absolute z-30 bg-green-600/40" />}

					{selecteds && selecteds.length > 0 ? (
						selecteds.map((selected) => {
							const product = areaProducts.find(
								(pro) => pro.id === selected.id
							);

							if (!product) {
								return;
							}

							return (
								<SellProductItem
									selecteds={selecteds}
									key={selected.uuid}
									onUpdateSelected={onUpdateSelected}
									selected={selected}
									disabled={disabled}
									areaProduct={product}
								/>
							);
						})
					) : (
						<div className="text-sm uppercase text-pretty text-center py-5 tracking-wider ">
							{_("sell_add_product")}
						</div>
					)}
				</div>

				<div className=" flex gap-2 items-center">
					<span className="text-base text-pretty font-semibold">
						{_("total")}
					</span>
					<span className="text-lg text-green-500 tracking-wide font-bold">
						{formatCurrency(total)}
					</span>
				</div>

				<Button disabled={disabled} onClick={onSubmit}>
					{loading ? <Loader2 className="animate-spin" /> : _("sell")}
				</Button>
			</CardContent>
		</Card>
	);
}
