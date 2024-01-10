"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { SellArea, SellAreaProduct } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormErrors } from "@/components/error/FormErrors";

import { ProductsWithPrices } from "@/lib/types";
import { TableProduct } from "./table-product";

import { useAction } from "@/hooks/useAction";
import { createSellArea } from "@/actions/sell-area/create-sell-area";
import { editSellArea } from "@/actions/sell-area/edit-sell-area";

export function CreateSellArea({
	products,
	area,
	areaProducts,
}: {
	products: ProductsWithPrices[];
	area?: SellArea;
	areaProducts?: SellAreaProduct[];
}) {
	// Create the state selected products with the already selected area products or with the products with visible state
	const [selectedProduct, setSelectedProduct] = useState<
		{ id: number; cant: number }[]
	>(
		areaProducts
			? areaProducts.map((areaProduct) => {
					return { id: areaProduct.productId, cant: areaProduct.aviable || 0 };
			  })
			: products
					.filter((product) => {
						return product.status === "visible" && product.aviable > 0;
					})
					.map((product) => {
						return { id: product.id, cant: product.aviable };
					})
	);

	const [search, setSearch] = useState("");
	const [productSearched, setProductSearched] = useState(products);

	const handleSelecteds = (id: number) => {
		const selected = selectedProduct.find(
			(selectedProduct) => selectedProduct.id === id
		);

		if (selected) {
			setSelectedProduct(selectedProduct.filter((p) => p.id !== id));
		} else {
			setSelectedProduct([
				...selectedProduct,
				{
					id: id,
					cant: products.find((p) => p.id === id)?.aviable || 0,
				},
			]);
		}
	};

	const handleChange = (value: string, id: number) => {
		const selected = selectedProduct.find(
			(selectedProduct) => selectedProduct.id === id
		);

		const product = products.find((product) => product.id === id);

		if (!product || !selected) {
			return;
		}

		let cant = Number(value) || 0;

		if (cant < 0) {
			cant = 0;
		}

		if (cant > product.aviable) {
			cant = product.aviable;
		}

		selected.cant = cant;

		setSelectedProduct([...selectedProduct]);
	};

	const handleSearch = (value: string) => {
		setSearch(value);

		const regex = new RegExp(`${value}`, "i");

		setProductSearched(products.filter((pro) => regex.test(pro.name)));
	};

	const { push } = useRouter();

	const { execute: createSell, fieldErrors: createFieldsErrors } = useAction(
		createSellArea,
		{
			onSuccess: (data) => {
				toast.success("Sell area created successfully");
				push(`/panel/sell-area`);
			},
			onError: (error) => {
				toast.error(error);
			},
		}
	);

	const { execute: editSell, fieldErrors: editFieldsErrors } = useAction(
		editSellArea,
		{
			onSuccess: (data) => {
				toast.success("Sell area updated successfully");
				push(`/panel/sell-area`);
			},
			onError: (error) => {
				toast.error(error);
			},
		}
	);

	const onSubmit = () => {
		if (area) {
			editSell({ selecteds: selectedProduct, id: area.id });
		} else {
			createSell({ selecteds: selectedProduct });
		}
	};

	const fieldsErrors = area ? editFieldsErrors : createFieldsErrors;

	return (
		<div className="relative">
			<form action={onSubmit}>
				<SellAreaFormBotton
					search={search}
					handleSearch={handleSearch}
					errors={fieldsErrors}
				/>

				<div className="flex flex-col space-y-2">
					<h2 className="text-xl font-semibold">
						The products already selected to the sell area
					</h2>
					<p className="text-base text-muted-foreground">
						This is the list of all the products with his cant that will be
						aviable in the sell area
					</p>

					<TableProduct
						handleChange={handleChange}
						handleSelected={handleSelecteds}
						products={productSearched}
						selecteds={selectedProduct}
						selected={true}
					/>
				</div>

				<Separator className="my-6" />

				<div className="flex flex-col space-y-2">
					<h2 className="text-xl font-semibold">The products aviables</h2>

					<p className="text-base text-muted-foreground">
						This is the list of all the products that you can add to the sell
						area
					</p>

					<TableProduct
						handleSelected={handleSelecteds}
						products={productSearched}
						selecteds={selectedProduct}
					/>
				</div>
			</form>
		</div>
	);
}

const SellAreaFormBotton = ({
	search,
	handleSearch,
	errors,
}: {
	search: string;
	handleSearch: (value: string) => void;
	errors?: Record<string, string[] | undefined>;
}) => {
	const { pending } = useFormStatus();

	return (
		<>
			<div className="flex justify-between w-full py-5 gap-5">
				<Input
					placeholder="Search products..."
					value={search}
					disabled={pending}
					onChange={(e) => handleSearch(e.target.value)}
					name="search"
				/>

				<div>
					<Button disabled={pending}>
						{pending ? <Loader2 className="animate-spin" /> : "Save"}
					</Button>
				</div>
			</div>
			<FormErrors errors={errors} id="selecteds" />
		</>
	);
};
