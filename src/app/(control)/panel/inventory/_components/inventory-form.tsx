"use client";

import { useRef } from "react";
import toast from "react-hot-toast";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { InventoryBody } from "./inventory-body";
import { createInventory } from "@/actions/inventories/add-inventory";
import { DataType } from "@/lib/types";
import { useAction } from "@/hooks/useAction";

export function InventoryForm({ products }: { products: DataType[] }) {
	const form = useRef<HTMLFormElement>(null);

	const { execute, fieldErrors } = useAction(createInventory, {
		onSuccess: () => {
			form.current?.reset();
			toast.success("Inventory added successfully");
		},
		onError(error) {
			toast.error(error);
		},
	});

	const onSubmit = (formdata: FormData) => {
		const cant = Number(formdata.get("cant"));
		const cost = Number(formdata.get("cost"));
		const product = Number(formdata.get("product"));

		execute({ cant, cost, product });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add a inventory</CardTitle>
				<CardDescription>Add a entry of a product</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={onSubmit} className="flex flex-col gap-5" ref={form}>
					<InventoryBody products={products} errors={fieldErrors} />
				</form>
			</CardContent>
		</Card>
	);
}
