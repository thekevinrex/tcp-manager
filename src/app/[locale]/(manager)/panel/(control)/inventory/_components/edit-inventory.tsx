import { Loader2, Pencil, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	DialogClose,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Modal } from "@/components/modal";
import { editInventory } from "@/actions/inventories/edit-inventory";

import { useAction } from "@/hooks/useAction";
import { InventoryWithProduct } from "@/lib/types";

export const EditInventory = ({
	inventory,
}: {
	inventory: InventoryWithProduct;
}) => {
	const _ = useTranslations("inventories");

	const [cost, setCost] = useState(inventory.total);
	const [cant, setCant] = useState(0);
	const [updateAll, setUpdateAll] = useState(false);

	const [open, setOpen] = useState(false);

	const { isLoading, execute } = useAction(editInventory, {
		onSuccess: () => {
			toast.success(_("inventory_updated_successfully"));
			setOpen(false);
		},
		onError(error) {
			toast.error(error);
		},
	});

	const handleAction = () => {
		execute({ cant, update_all: updateAll, id: inventory.id, cost });
	};

	return (
		<Modal
			title={_("inventory_edit_title")}
			description={_("inventory_edit_description")}
			open={open}
			openChange={(open) => setOpen(open)}
			trigger={
				<DialogTrigger asChild>
					<Button variant={"ghost"}>
						<Pencil />
					</Button>
				</DialogTrigger>
			}
			dialogClass="sm:max-w-[550px]"
		>
			<Label htmlFor="cost_inventory">{_("inventory_cost")}</Label>
			<Input
				id="cost_inventory"
				type="number"
				placeholder={_("inventory_cost")}
				value={cost}
				disabled={isLoading}
				onChange={(e) => setCost(Number(e.target.value))}
			/>

			<Label className="items-center flex gap-3 mb-5">
				<Checkbox
					disabled={isLoading}
					defaultChecked={updateAll}
					onCheckedChange={(checked: boolean) => setUpdateAll(checked)}
				/>
				{_("inventory_update_sell_cost")}
			</Label>

			<Label htmlFor="cant_inventory">{_("inventory_cant")}</Label>
			<Input
				id="cant_inventory"
				type="number"
				disabled={isLoading}
				placeholder={_("inventory_cant")}
				value={cant}
				onChange={(e) => setCant(Number(e.target.value))}
			/>
			<Alert>
				<Terminal className="h-4 w-4" />
				<AlertTitle>{_("important")}</AlertTitle>
				<AlertDescription>{_("inventory_update_cant")}</AlertDescription>
			</Alert>

			<DialogFooter>
				<DialogClose asChild>
					<Button variant={"outline"}>{_("cancel")}</Button>
				</DialogClose>

				<Button type="button" onClick={handleAction} disabled={isLoading}>
					{isLoading ? <Loader2 className="animate-spin" /> : _("save")}
				</Button>
			</DialogFooter>
		</Modal>
	);
};
