"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { SupabaseImage } from "@/components/Image";
import { ProductsWithPrices } from "@/lib/types";
import { useTranslations } from "next-intl";

export function ProductDraggableItem({
	areaProduct,
	onAdded,
	added = 0,
	addProduct,
}: {
	areaProduct: ProductsWithPrices;
	onAdded?: (add: number) => void;
	added?: number;
	addProduct?: (productId: number) => void;
}) {
	const _ = useTranslations("areas");
	const { id, aviable, name, image } = areaProduct;

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

	return (
		<article className="flex flex-col border bg-background rounded-md">
			<div className="w-full h-[150px] flex rounded-md overflow-hidden relative">
				<SupabaseImage
					src={image}
					alt={name}
					style={{ width: "100%", height: "auto" }}
				/>
			</div>

			<div className="p-4">
				<h3 className="text-lg font-bold text-pretty tracking-wide">{name}</h3>
				<Badge variant={"green"}>{_("aviable", { aviable })}</Badge>
			</div>

			<div className="flex flex-row justify-between px-2 gap-x-3 pb-2">
				<div className="flex items-center space-x-2" data-no-dnd="true">
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							if (selected > 0) handleAdded(selected - 1);
						}}
						variant={"outline"}
						className="w-[25px] p-0 shrink-0"
					>
						<ChevronLeft />
					</Button>
					<Input
						className=""
						value={selected}
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
						variant={"outline"}
					>
						<ChevronRight />
					</Button>
				</div>

				<div className="shrink-0" data-no-dnd="true">
					<Button onClick={handleAddProduct} variant={"secondary"}>
						{_("add")}
					</Button>
				</div>
			</div>
		</article>
	);
}
