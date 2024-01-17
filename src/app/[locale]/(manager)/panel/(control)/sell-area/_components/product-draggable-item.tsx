"use client";

import { useEffect, useState } from "react";
import {
	ChevronRight,
	ChevronLeft,
	CreditCardIcon,
	ArrowRight,
	Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ProductsWithPrices } from "@/lib/types";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ProductDraggableItem({
	areaProduct,
	onAdded,
	added = 0,
	addProduct,
	excecuteSell,
	loading,
	disabled,
	children,
}: {
	areaProduct: ProductsWithPrices;
	onAdded?: (add: number) => void;
	added?: number;
	addProduct?: (productId: number) => void;
	excecuteSell?: ({ added, id }: { added: number; id: number }) => void;
	loading: boolean;
	disabled: boolean;
	children: React.ReactNode;
}) {
	const _ = useTranslations("areas");
	const { id, aviable, name } = areaProduct;

	const [selected, setSelected] = useState(added);

	const handleAdded = (toAdd: number) => {
		if (toAdd < 0) {
			toAdd = 0;
		}

		if (toAdd > aviable) {
			toAdd = aviable;
		}

		setSelected(toAdd);
		if (onAdded) {
			onAdded(toAdd);
		}
	};

	const handleAddProduct = () => {
		if (selected === 0) {
			return;
		}

		if (addProduct && id) {
			addProduct(id);
		}
	};

	useEffect(() => {
		setSelected(added);
	}, [added]);

	const handleSell = () => {
		if (!excecuteSell || added <= 0) {
			return;
		}

		excecuteSell({ added, id });
	};

	return (
		<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3">
			{children}

			<div className="flex flex-row p-2 pt-0 sm:p-4 gap-x-3 items-center h-full justify-end ">
				<div className="flex items-center space-x-2">
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (selected > 0) handleAdded(selected - 1);
						}}
						variant={"outline"}
						className="w-[25px] p-0 shrink-0"
						disabled={loading || disabled}
					>
						<ChevronLeft />
					</Button>
					<Input
						className="max-w-[100px] min-w-[60px]"
						value={selected}
						disabled={loading || disabled}
						placeholder={_("cant")}
						type="number"
						onChange={(e) => handleAdded(Number(e.target.value) || 0)}
					/>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (selected < aviable) handleAdded(selected + 1);
						}}
						className="w-[25px] p-0 shrink-0"
						disabled={loading || disabled}
						variant={"outline"}
					>
						<ChevronRight />
					</Button>
				</div>

				<div className="shrink-0 flex items-center gap-x-3">
					<Button
						disabled={loading || disabled}
						onClick={handleSell}
						variant={"secondary"}
					>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<CreditCardIcon />
						)}
					</Button>
					<Button
						disabled={loading || disabled}
						onClick={handleAddProduct}
						className="gap-x-2 flex"
					>
						<span className="hidden md:flex">{_("add")}</span>
						<ArrowRight />
					</Button>
				</div>
			</div>
		</article>
	);
}
