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

import { ProductBody } from "./_components/product-body";
import { Prices, StatusType } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { createProduct } from "@/actions/products/create-product";

export function CreateProduct() {
	const form = useRef<HTMLFormElement>(null);

	const [priceBreackdown, setPriceBreackdown] = useState<Prices[]>([]);

	const handleBreackdowns = (prices: Prices[]) => {
		setPriceBreackdown([...prices]);
	};

	const { execute, fieldErrors } = useAction(createProduct, {
		onSuccess: () => {
			toast.success("Product added successfully");
			form.current?.reset();
		},
		onError: (err: any) => {
			toast.error(err);
		},
	});

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
			prices: priceBreackdown,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add a product</CardTitle>
				<CardDescription>
					Add a new producto to your organizations this product is necesary for
					the landing page and the sell area
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={onSubmit} className="flex flex-col gap-5" ref={form}>
					<ProductBody
						errors={fieldErrors}
						prices={priceBreackdown}
						handlePrices={handleBreackdowns}
					/>
				</form>
			</CardContent>
		</Card>
	);
}

export default CreateProduct;
