import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SellAreaProductWithProduct } from "@/lib/types";
import { calcPriceBreakdown } from "@/lib/utils";
import { SelectedFn, SelectedType } from "../sell-area";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Modal } from "@/components/modal";
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export function SellProductItem({
	areaProduct,
	onUpdateSelected,
	selected,
}: {
	areaProduct: SellAreaProductWithProduct;
	selected: SelectedType;
	onUpdateSelected: SelectedFn;
}) {
	const { aviable, id } = areaProduct;
	const { name } = areaProduct.product;
	const { added, price: selectedPrice } = selected;

	const [total, setTotal] = useState(added);
	const [finalPrice, setFinalPrice] = useState(
		selectedPrice !== null
			? selectedPrice
			: calcPriceBreakdown({ total: added, product: areaProduct.product })
	);

	const handleAdded = (add: number) => {
		if (add < 0) {
			add = 0;
		}

		if (add > aviable) {
			add = aviable;
		}

		setTotal(add);

		if (selectedPrice === null) {
			setFinalPrice(
				calcPriceBreakdown({ total: add, product: areaProduct.product })
			);
		}

		onUpdateSelected({ total: add, productId: id });
	};

	useEffect(() => {
		setTotal(added);
	}, [added]);

	useEffect(() => {
		setFinalPrice(
			selectedPrice !== null
				? selectedPrice
				: calcPriceBreakdown({ total: added, product: areaProduct.product })
		);
	}, [areaProduct, selectedPrice, added]);

	return (
		<article className="flex flex-col py-2 gap-5">
			<header className="flex justify-between">
				<h3 className="text-base font-semibold text-pretty tracking-tight">
					{name}
				</h3>
				<PriceBadge
					areaProduct={areaProduct}
					price={finalPrice}
					onUpdate={onUpdateSelected}
				/>
			</header>

			<div className="flex flex-row justify-between px-2 gap-x-3 pb-2">
				<div className="flex items-center space-x-2">
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (total > 0) handleAdded(total - 1);
						}}
						type="button"
						variant={"outline"}
						className="w-[25px] p-0 shrink-0"
					>
						<ChevronLeft />
					</Button>
					<Input
						className=""
						value={total}
						placeholder="Cant"
						type="number"
						onChange={(e) => handleAdded(Number(e.target.value) || 0)}
					/>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (total < aviable) handleAdded(total + 1);
						}}
						type="button"
						className="w-[25px] p-0 shrink-0"
						variant={"outline"}
					>
						<ChevronRight />
					</Button>
				</div>

				<div className="shrink-0">
					<Button
						type="button"
						variant={"destructive"}
						onClick={() => handleAdded(0)}
					>
						<Trash />
					</Button>
				</div>
			</div>
		</article>
	);
}

const PriceBadge = ({
	areaProduct,
	price,
	onUpdate,
}: {
	areaProduct: SellAreaProductWithProduct;
	price: number;
	onUpdate: SelectedFn;
}) => {
	const [customPrice, setCustomPrice] = useState(price);
	const [open, setOpen] = useState(false);

	const handleAction = () => {
		onUpdate({ price: customPrice, productId: areaProduct.id });
		setOpen(false);
	};

	const handleResetAction = () => {
		onUpdate({ price: null, productId: areaProduct.id });
		setOpen(false);
	};

	return (
		<Modal
			title="Set sell price for the selected product"
			description="Are you sure you want to set the sell price for the selected product? If you unselect and selected the product the custom price will be reseted to the default"
			open={open}
			openChange={(open) => setOpen(open)}
			trigger={
				<DialogTrigger>
					<Badge variant={"green"}>Price : {price}</Badge>
				</DialogTrigger>
			}
			dialogClass="sm:max-w-[550px]"
		>
			<Input
				type="number"
				placeholder="Custom price"
				value={customPrice}
				onChange={(e) => setCustomPrice(Number(e.target.value))}
			/>

			<DialogFooter>
				<Button variant={"secondary"} onClick={handleResetAction}>
					Reset
				</Button>
				<Button type="button" onClick={handleAction}>
					Save
				</Button>
			</DialogFooter>
		</Modal>
	);
};