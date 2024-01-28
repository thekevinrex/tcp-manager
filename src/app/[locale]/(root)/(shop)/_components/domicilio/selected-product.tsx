import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductsWithPrices } from "@/lib/types";

export const SelectedProduct = ({
	product,
	handleAdded,
	total,
}: {
	product: ProductsWithPrices;
	total: number;
	handleAdded: (total: number) => void;
}) => {
	const { pending } = useFormStatus();
	const _ = useTranslations("home");

	return (
		<div className="flex flex-col gap-y-2 border rounded-md p-2">
			<span className="text-sm font-semibold">{product.name}</span>
			<div className="flex justify-between gap-x-3">
				<Button
					variant={"destructive"}
					onClick={() => handleAdded(0)}
					size={"sm"}
					disabled={pending}
				>
					<Trash className="size-4" />
				</Button>

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
						size={"sm"}
					>
						<ChevronLeft />
					</Button>
					<Input
						className="h-9"
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
							handleAdded(total + 1);
						}}
						type="button"
						size={"sm"}
						disabled={pending}
						className="w-[25px] p-0 shrink-0"
						variant={"outline"}
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	);
};
