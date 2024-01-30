import { Table } from "@tanstack/react-table";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { SellWithProduct } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { deleteSells } from "@/actions/sell/delete-sells";

export function SelectedSells({ table }: { table: Table<SellWithProduct> }) {
	const selecteds = table.getSelectedRowModel().rows;
	const _ = useTranslations("sells");

	return (
		<div className="flex flex-col p-5 mb-5 border rounded-md space-y-3 relative">
			{/* Title */}
			<span className="text-lg font-semibold">
				{_("selected", { selected: selecteds.length })}
			</span>
			{/* Selected Products actions */}
			<div className="flex flex-row gap-5">
				<DeleteBotton table={table} />
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
	table: Table<SellWithProduct>;
}) => {
	const _ = useTranslations("sells");

	const { execute, isLoading: loading } = useAction(deleteSells, {
		onSuccess: () => {
			toast.success(_("sell_deleted_successfully"));
			table.resetRowSelection();
		},
		onError: (err: any) => {
			toast.error(err);
		},
	});

	const sells = table.getSelectedRowModel().rows.map((row) => {
		return row.original.id;
	});

	const handleAction = () => {
		execute({ sells });
	};

	return (
		<AlertModal
			title={all ? _("sell_delete_title_all") : _("sell_delete_title")}
			description={_("sell_delete_des")}
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="animate-spin" />
							</>
						) : all ? (
							_("sell_delete_title_all")
						) : (
							_("sell_delete_title")
						)}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
