import { useDroppable } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SellArea } from "@prisma/client";
import { useFormStatus } from "react-dom";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/error/FormErrors";

import { calcPriceBreakdown, cn } from "@/lib/utils";
import { SellProductItem } from "./sell-product-item";

import { SellAreaProductWithProduct } from "@/lib/types";
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
	areaProducts: SellAreaProductWithProduct[];
	area: SellArea;
}) {
	const uuid = useMemo(() => crypto.randomUUID(), []);

	const { setNodeRef } = useDroppable({
		id: "drop-product-" + uuid,
	});

	const [total, setTotal] = useState(0);

	// Calc sell price
	useEffect(() => {
		let posibleTotal = 0;
		for (const selected of selecteds) {
			const product = areaProducts.find((p) => p.id === selected.id)?.product;

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
			toast.success("Inventory updated successfully");
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
				<CardTitle>Add a inventory</CardTitle>
				<CardDescription>Add a entry of a product</CardDescription>
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
								Drop here products to add or press the add botton
							</div>
						)}
					</div>

					<FormErrors id="selecteds" errors={fieldErrors} />

					<div className=" flex gap-2">
						<span className="text-base text-pretty font-semibold">Total :</span>
						<span>{total}</span>
					</div>

					<FormBotton />
				</CardContent>
			</form>
		</Card>
	);
}

const FormBotton = () => {
	const { pending } = useFormStatus();

	return (
		<>
			{pending && (
				<div className="inset-0 absolute z-50 bg-black/40 flex items-center justify-center text-red-600 text-lg uppercase text-balance tracking-widest text-center">
					Dont do anything while is still loading...
				</div>
			)}
			<Button disabled={pending}>
				{pending ? <Loader2 className="animate-spin" /> : "Sell"}
			</Button>
		</>
	);
};
