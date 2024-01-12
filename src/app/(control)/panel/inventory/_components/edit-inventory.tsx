import { editInventory } from "@/actions/inventories/edit-inventory";
import { Modal } from "@/components/modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks/useAction";
import { InventoryWithProduct } from "@/lib/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2, Pencil, Terminal } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const EditInventory = ({
	inventory,
}: {
	inventory: InventoryWithProduct;
}) => {
	const [cost, setCost] = useState(inventory.total);
	const [cant, setCant] = useState(0);
	const [updateAll, setUpdateAll] = useState(false);

	const [open, setOpen] = useState(false);

	const { isLoading, execute } = useAction(editInventory, {
		onSuccess: () => {
			toast.success("Inventory updated successfully");
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
			title="Edit inventory"
			description="Edit the inventory cant and cost, but be careful any change may have serious impact in the stadistics"
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
			<Label htmlFor="cost_inventory">Cost of the inventory</Label>
			<Input
				id="cost_inventory"
				type="number"
				placeholder="Cost of inventory"
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
				Update all sell of this inventory
			</Label>

			<Label htmlFor="cant_inventory">Cant of the inventory</Label>
			<Input
				id="cant_inventory"
				type="number"
				disabled={isLoading}
				placeholder="cant of inventory"
				value={cant}
				onChange={(e) => setCant(Number(e.target.value))}
			/>
			<Alert>
				<Terminal className="h-4 w-4" />
				<AlertTitle>Importante!</AlertTitle>
				<AlertDescription>
					If you update the cant of the inventory, it will no modify any sell,
					it only going to modify the aviable quantity of the product of this
					inventory.
				</AlertDescription>
			</Alert>

			<DialogFooter>
				<DialogClose />

				<Button type="button" onClick={handleAction} disabled={isLoading}>
					{isLoading ? <Loader2 className="animate-spin" /> : "Save"}
				</Button>
			</DialogFooter>
		</Modal>
	);
};
