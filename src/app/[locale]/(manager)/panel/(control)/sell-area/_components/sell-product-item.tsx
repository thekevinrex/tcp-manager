import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ProductsWithPrices } from "@/lib/types";
import { calcPriceBreakdown } from "@/lib/utils";
import { SelectedFn, SelectedType } from "../sell-area";
import { Modal } from "@/components/modal";
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

export function SellProductItem({
	areaProduct,
	onUpdateSelected,
	selected,
	selecteds,
	disabled: pending,
}: {
	areaProduct: ProductsWithPrices;
	selected: SelectedType;
	onUpdateSelected: SelectedFn;
	selecteds: SelectedType[];
	disabled: boolean;
}) {
	const _ = useTranslations("sells");

	const { aviable, id, name } = areaProduct;
	const { added, price: selectedPrice, uuid } = selected;

	const [total, setTotal] = useState(added);
	const [finalPrice, setFinalPrice] = useState(
		selectedPrice !== null
			? selectedPrice
			: calcPriceBreakdown({ total: added, product: areaProduct })
	);

	const alreadySelected = selecteds.filter(
		(sele) => sele.id === id && sele.uuid !== uuid
	);

	const trueAviable =
		aviable -
		(alreadySelected?.reduce((acc, item) => acc + item.added, 0) || 0);

	const handleAdded = (add: number) => {
		if (add < 0) {
			add = 0;
		}

		if (add > trueAviable) {
			add = trueAviable;
		}

		setTotal(add);

		if (selectedPrice === null) {
			setFinalPrice(calcPriceBreakdown({ total: add, product: areaProduct }));
		}

		onUpdateSelected({ total: add, uuid });
	};

	useEffect(() => {
		setTotal(added);
	}, [added]);

	useEffect(() => {
		setFinalPrice(
			selectedPrice !== null
				? selectedPrice
				: calcPriceBreakdown({ total: added, product: areaProduct })
		);
	}, [areaProduct, selectedPrice, added]);

	return (
		<article className="flex flex-col py-2 gap-5">
			<header className="flex justify-between items-center">
				<h3 className="text-base font-semibold text-pretty tracking-tight">
					{name}
				</h3>
				<PriceBadge
					uuid={uuid}
					price={finalPrice}
					disabled={pending}
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
						disabled={pending}
						className="w-[25px] p-0 shrink-0"
					>
						<ChevronLeft />
					</Button>
					<Input
						className=""
						value={total}
						placeholder={_("cant")}
						disabled={pending}
						type="number"
						onChange={(e) => handleAdded(Number(e.target.value) || 0)}
					/>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (total < trueAviable) handleAdded(total + 1);
						}}
						type="button"
						disabled={pending}
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
						disabled={pending}
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
	uuid,
	price,
	onUpdate,
	disabled: pending,
}: {
	uuid: string;
	price: number;
	onUpdate: SelectedFn;
	disabled: boolean;
}) => {
	const _ = useTranslations("sells");

	const [customPrice, setCustomPrice] = useState(price);
	const [open, setOpen] = useState(false);

	const handleAction = () => {
		onUpdate({ price: customPrice, uuid });
		setOpen(false);
	};

	const handleResetAction = () => {
		onUpdate({ price: null, uuid });
		setOpen(false);
	};

	return (
		<Modal
			title={_("sell_price_title")}
			description={_("sell_price_des")}
			open={open}
			openChange={(open) => setOpen(open)}
			trigger={
				<DialogTrigger disabled={pending}>
					<Badge variant={"green"} className="shrink-0 cursor-pointer">
						{_("price", { price })}
					</Badge>
				</DialogTrigger>
			}
			dialogClass="sm:max-w-[550px]"
		>
			<Input
				type="number"
				placeholder={_("sell_price")}
				disabled={pending}
				value={customPrice}
				onChange={(e) => setCustomPrice(Number(e.target.value))}
			/>

			<DialogFooter>
				<Button
					variant={"secondary"}
					onClick={handleResetAction}
					disabled={pending}
				>
					{_("reset")}
				</Button>
				<Button type="button" onClick={handleAction} disabled={pending}>
					{_("save")}
				</Button>
			</DialogFooter>
		</Modal>
	);
};
