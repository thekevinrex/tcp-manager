import { Table } from "@tanstack/react-table";
import { useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { Modal } from "@/components/modal";
import { AlertModal } from "@/components/dialog";

import { ProductBody } from "./product-body";
import { Prices, ProductsWithPrices, StatusType } from "@/lib/types";

import { editProduct } from "@/actions/products/edit-product/";
import { PriceBreakdown } from "@prisma/client";
import { useAction } from "@/hooks/useAction";
import { deleteProduct } from "@/actions/products/delete-product";

export function SelectedProducts({
	table,
}: {
	table: Table<ProductsWithPrices>;
}) {
	const selecteds = table.getSelectedRowModel().rows;

	return (
		<div className="flex flex-col p-5 mb-5 border rounded-md space-y-3 relative">
			{/* Title */}
			<span className="text-lg font-semibold">{`Selected - ${selecteds.length}`}</span>
			{/* Selected Products actions */}
			<div className="flex flex-row gap-5">
				<DeleteBotton table={table} />
				{selecteds.length == 1 && (
					<EditButton product={selecteds[0].original} table={table} />
				)}
			</div>

			<X
				className="absolute top-1 right-4 cursor-pointer z-10"
				onClick={() => table.resetRowSelection()}
			/>
		</div>
	);
}

const EditButton = ({
	product,
	table,
}: {
	product: ProductsWithPrices;
	table: Table<ProductsWithPrices>;
}) => {
	const form = useRef<HTMLFormElement>(null);

	const { execute, fieldErrors } = useAction(editProduct, {
		onSuccess: () => {
			toast.success("Product edited successfully");
			form.current?.reset();
			table.resetRowSelection();
		},
		onError: (err: any) => {
			toast.error(err);
		},
	});

	const [priceBreackdown, setPriceBreackdown] = useState<Prices[]>(
		product.prices?.map((price: PriceBreakdown): Prices => {
			return {
				cant: price.cant,
				value: price.value,
				uuid: crypto.randomUUID(),
			};
		}) || []
	);

	const handleBreackdowns = (prices: Prices[]) => {
		setPriceBreackdown([...prices]);
	};

	const onSubmit = (formdata: FormData) => {
		const name = formdata.get("name") as string;
		const price = Number(formdata.get("price"));
		const description = formdata.get("description") as string;
		const status = formdata.get("status") as StatusType;

		execute({
			name,
			price,
			description,
			status,
			formdata,
			id: product.id,
			prices: priceBreackdown,
		});
	};

	return (
		<Modal
			title="Edit Product"
			description="Make changes to the product here. Click save when you're done."
			trigger={
				<DialogTrigger asChild>
					<Button variant="secondary">Edit</Button>
				</DialogTrigger>
			}
			dialogClass="sm:max-w-[550px]"
		>
			<form action={onSubmit} className="flex flex-col gap-5" ref={form}>
				<ProductBody
					errors={fieldErrors}
					product={product}
					prices={priceBreackdown}
					handlePrices={handleBreackdowns}
				/>
			</form>
		</Modal>
	);
};

const DeleteBotton = ({
	all = false,
	table,
}: {
	all?: boolean;
	table: Table<ProductsWithPrices>;
}) => {
	const { execute, isLoading: loading } = useAction(deleteProduct, {
		onSuccess: () => {
			toast.success("Product deleted successfully");
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
			title={all ? "Delete all products" : "Delete the selecteds products"}
			description="Are you sure you want to delete the products?"
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="animate-spin mr-3" />
								Deleting...
							</>
						) : all ? (
							"Delete all products"
						) : (
							"Delete selecteds products"
						)}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
