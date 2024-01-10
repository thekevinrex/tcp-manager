import { Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { SellWithProduct } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { deleteSells } from "@/actions/sell/delete-sells";

export function SelectedSells({ table }: { table: Table<SellWithProduct> }) {
	const selecteds = table.getSelectedRowModel().rows;

	return (
		<div className="flex flex-col p-5 mb-5 border rounded-md space-y-3">
			{/* Title */}
			<span className="text-lg font-semibold">{`Selected - ${selecteds.length}`}</span>
			{/* Selected Products actions */}
			<div className="flex flex-row gap-5">
				<DeleteBotton table={table} />
			</div>
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
	const { execute, isLoading: loading } = useAction(deleteSells, {
		onSuccess: () => {
			toast.success("Sells deleted successfully");
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
			title={all ? "Delete all sells" : "Delete the selecteds sells"}
			description="Are you sure you want to delete the sells?"
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="animate-spin mr-3" />
								Deleting...
							</>
						) : all ? (
							"Delete all sells"
						) : (
							"Delete selecteds sells"
						)}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
