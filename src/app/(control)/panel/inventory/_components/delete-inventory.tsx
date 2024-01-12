import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { InventoryWithProduct } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAction } from "@/hooks/useAction";
import { deleteInventory } from "@/actions/inventories/delete-inventory";

export const DeleteBotton = ({
	inventory,
}: {
	inventory: InventoryWithProduct;
}) => {
	const { execute, isLoading: loading } = useAction(deleteInventory, {
		onSuccess: () => {
			toast.success("Inventory deleted successfully");
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const handleAction = () => {
		execute({ id: inventory.id });
	};

	return (
		<AlertModal
			title={"Delete inventory"}
			description="Are you sure you want to delete the inventory, if yoy delete the inventory the product aviable cant is going to decrease in the cant of the inventory?"
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
