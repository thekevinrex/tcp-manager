"use client";
import { Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { changeVisibility } from "@/actions/products/visibility";
import { useAction } from "@/hooks/useAction";
import { ProductsWithPrices } from "@/lib/types";

export const VisibilityChange = ({
	table,
}: {
	table: Table<ProductsWithPrices>;
}) => {
	const _ = useTranslations("products");
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<string>("");

	const STATES = [
		{ value: "hidden", label: _("hidden") },
		{ value: "out_stock", label: _("out_stock") },
		{ value: "visible", label: _("visible") },
	];

	const changeState = (state: string) => {
		setSelected(state);
		setOpen(true);
	};

	const { execute, isLoading } = useAction(changeVisibility, {
		onSuccess() {
			toast.success(_("change_visibility_success"));
			table.resetRowSelection();
		},
		onError(error) {
			toast.error(error);
		},
	});

	const handleAction = () => {
		execute({
			state: selected,
			products: table.getSelectedRowModel().rows.map((p) => p.original.id),
		});
	};

	return (
		<>
			<AlertModal
				open={open}
				onOpenChange={(open) => setOpen(open)}
				title={_("change_visibility")}
				description={_("change_visibility_des")}
				onAction={handleAction}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"secondary"} disabled={isLoading}>
						{isLoading ? <Loader2 className="animate-spin" /> : _("status")}
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent>
					{STATES.map((state) => (
						<DropdownMenuItem
							key={state.value}
							onClick={() => changeState(state.value)}
						>
							{state.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
