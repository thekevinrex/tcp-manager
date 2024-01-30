"use client";
import { PriceBreakdown } from "@prisma/client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/modal";

import { Prices, ProductsWithPrices } from "@/lib/types";
import { editProduct } from "@/actions/products/edit-product/";

import { ProductBody } from "./product-body";
import { Table } from "@tanstack/react-table";
import { useAction } from "@/hooks/useAction";

export const EditButton = ({
	product,
	table,
}: {
	product: ProductsWithPrices;
	table?: Table<ProductsWithPrices>;
}) => {
	const _ = useTranslations("products");
	const form = useRef<HTMLFormElement>(null);
	const [open, setOpen] = useState(false);

	const { execute, fieldErrors } = useAction(editProduct, {
		onSuccess: () => {
			toast.success(_("product_edited_successfully"));
			form.current?.reset();

			if (table) {
				table.resetRowSelection();
			}

			setOpen(false);
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

		execute({
			name,
			price,
			id: product.id,
			prices: priceBreackdown,
		});
	};

	return (
		<Modal
			title={_("product_edit_title")}
			description={_("product_edit_des")}
			open={open}
			openChange={(open) => setOpen(open)}
			trigger={
				<DialogTrigger asChild>
					<Button variant="secondary">{_("edit")}</Button>
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
