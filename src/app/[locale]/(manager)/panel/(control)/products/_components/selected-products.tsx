import { Table } from "@tanstack/react-table";

import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { AlertModal } from "@/components/dialog";

import { ProductsWithPrices } from "@/lib/types";

import { useAction } from "@/hooks/useAction";
import { deleteProduct } from "@/actions/products/delete-product";
import { useTranslations } from "next-intl";
import { EditButton } from "./edit-product";

import { VisibilityChange } from "./change-visibility";

export function SelectedProducts({
	table,
}: {
	table: Table<ProductsWithPrices>;
}) {
	const _ = useTranslations("products");
	const selecteds = table.getSelectedRowModel().rows;

	return (
		<div className="flex flex-col p-5 mb-5 border rounded-md space-y-3 relative">
			{/* Title */}
			<span className="text-lg font-semibold">
				{_("selected", { selected: selecteds.length })}
			</span>
			{/* Selected Products actions */}
			<div className="flex flex-row gap-5">
				<DeleteBotton table={table} />
				{selecteds.length == 1 && (
					<EditButton product={selecteds[0].original} table={table} />
				)}

				<VisibilityChange table={table} />
			</div>

			<X
				className="absolute top-1 right-4 cursor-pointer z-10"
				onClick={() => table.resetRowSelection()}
			/>
		</div>
	);
}

const DeleteBotton = ({
	all = false,
	table,
}: {
	all?: boolean;
	table: Table<ProductsWithPrices>;
}) => {
	const _ = useTranslations("products");

	const { execute, isLoading: loading } = useAction(deleteProduct, {
		onSuccess: () => {
			toast.success(_("product_deleted_successfully"));
			table.resetRowSelection();
		},
		onError: (err: any) => {
			toast.error(err);
		},
	});

	const products = table.getSelectedRowModel().rows.map((row) => {
		return row.original.id || 0;
	});

	const handleAction = () => {
		execute({ products });
	};

	return (
		<AlertModal
			title={all ? _("product_delete_title_all") : _("product_delete_title")}
			description={_("product_delete_des")}
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="animate-spin" />
							</>
						) : all ? (
							_("product_delete_title_all")
						) : (
							_("product_delete_title")
						)}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
