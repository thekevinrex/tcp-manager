import { useDroppable } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SellArea } from "@prisma/client";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/error/FormErrors";

import { calcPriceBreakdown, cn, formatCurrency } from "@/lib/utils";
import { SellProductItem } from "./sell-product-item";

import { ProductsWithPrices } from "@/lib/types";
import { SelectedFn, SelectedType } from "../sell-area";

import { useAction } from "@/hooks/useAction";
import { newSell } from "@/actions/sell/new-sell";

export function SellForm({
	over,
	selecteds,
	onUpdateSelected,
	areaProducts,
	area,
}: {
	over: boolean;
	selecteds: SelectedType[];
	onUpdateSelected: SelectedFn;
	areaProducts: ProductsWithPrices[];
	area: SellArea;
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

			posibleTotal += selected.price
				? selected.price * selected.added
				: calcPriceBreakdown({
						total: selected.added,
						product,
				  }) * selected.added;
		}

		setTotal(posibleTotal);
	}, [selecteds, areaProducts]);

	const { execute, fieldErrors } = useAction(newSell, {
		onSuccess: () => {
			onUpdateSelected({ total: 0 });
			toast.success(_("sell_added_successfully"));
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onSubmit = () => {
		execute({ selecteds, id: area.id });
	};

	return (
		<Card className="relative">
			<CardHeader>
				<CardTitle>{_("sell_box")}</CardTitle>
				<CardDescription>{_("sell_box_des")}</CardDescription>
			</CardHeader>
			<form action={onSubmit}>
				<CardContent className="flex flex-col gap-5">
					<div
						ref={setNodeRef}
						className={cn([
							"flex flex-col w-full p-2 h-auto border-y relative",
							over ? "border-green-500" : "",
						])}
					>
						{over && <div className="inset-0 absolute z-50 bg-green-600/40" />}

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

					<FormErrors id="selecteds" errors={fieldErrors} />

					<div className=" flex gap-2 items-center">
						<span className="text-base text-pretty font-semibold">
							{_("total")}
						</span>
						<span className="text-lg text-green-500 tracking-wide font-bold">
							{formatCurrency(total)}
						</span>
					</div>

					<FormBotton />
				</CardContent>
			</form>
		</Card>
	);
}

const FormBotton = () => {
	const { pending } = useFormStatus();
	const _ = useTranslations("sells");

	return (
		<Button disabled={pending}>
			{pending ? <Loader2 className="animate-spin" /> : _("sell")}
		</Button>
	);
};
