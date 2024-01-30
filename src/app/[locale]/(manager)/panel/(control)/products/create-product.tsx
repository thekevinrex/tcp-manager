"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { ProductBody } from "./_components/product-body";
import { Prices } from "@/lib/types";
import { useAction } from "@/hooks/useAction";
import { createProduct } from "@/actions/products/create-product";

export function CreateProduct() {
	const _ = useTranslations("products");
	const { push } = useRouter();
	const locale = useLocale();

	const form = useRef<HTMLFormElement>(null);
	const [priceBreackdown, setPriceBreackdown] = useState<Prices[]>([]);

	const handleBreackdowns = (prices: Prices[]) => {
		setPriceBreackdown([...prices]);
	};

	const { execute, fieldErrors } = useAction(createProduct, {
		onSuccess: ({ productId }) => {
			toast.success(_("product_created_successfully"));
			form.current?.reset();

			push(`/${locale}/panel/products/${productId}`);
		},
		onError: (err: any) => {
			toast.error(err);
		},
	});

	const onSubmit = (formdata: FormData) => {
		const name = formdata.get("name") as string;
		const price = Number(formdata.get("price"));

		execute({
			name,
			price,
			prices: priceBreackdown,
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{_("add_product")}</CardTitle>
				<CardDescription>{_("add_product_des")}</CardDescription>
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
