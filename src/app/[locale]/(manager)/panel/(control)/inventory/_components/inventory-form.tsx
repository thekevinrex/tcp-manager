"use client";

import { useRef, useState } from "react";
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
import { useTranslations } from "next-intl";

export function InventoryForm({ products }: { products: DataType[] }) {
	const _ = useTranslations("inventories");
	const form = useRef<HTMLFormElement>(null);
	const [product, setProduct] = useState("");

	const { execute, fieldErrors } = useAction(createInventory, {
		onSuccess: () => {
			form.current?.reset();
			setProduct("");
			toast.success(_("inventory_added_successfully"));
		},
		onError(error) {
			toast.error(error);
		},
	});

	const onSubmit = (formdata: FormData) => {
		const cant = Number(formdata.get("cant"));
		const cost = Number(formdata.get("cost"));

		execute({ cant, cost, product: Number(product) });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{_("inventory_add")}</CardTitle>
				<CardDescription>{_("inventory_add_des")}</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={onSubmit} className="flex flex-col gap-5" ref={form}>
					<InventoryBody
						product={product}
						setProduct={(product: string) => setProduct(product)}
						products={products}
						errors={fieldErrors}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
