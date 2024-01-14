import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { InventoryWithProduct } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAction } from "@/hooks/useAction";
import { deleteInventory } from "@/actions/inventories/delete-inventory";
import { useTranslations } from "next-intl";

export const DeleteBotton = ({
	inventory,
}: {
	inventory: InventoryWithProduct;
}) => {
	const _ = useTranslations("inventories");

	const { execute, isLoading: loading } = useAction(deleteInventory, {
		onSuccess: () => {
			toast.success(_("inventory_deleted_successfully"));
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
			title={_("inventory_delete_title")}
			description={_("inventory_delete_description")}
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
