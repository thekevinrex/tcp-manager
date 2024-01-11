import { Combobox } from "@/components/combobox";
import { FormErrors } from "@/components/error/FormErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataType } from "@/lib/types";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

export function InventoryBody({
	products,
	errors,
	product,
	setProduct,
}: {
	products: DataType[];
	errors?: Record<string, string[] | undefined>;
	product: string;
	setProduct: (product: string) => void;
}) {
	const { pending: loading } = useFormStatus();
	return (
		<>
			<label className="text-sm font-semibold">
				Cant of element to add
				<Input
					name="cant"
					disabled={loading}
					type="number"
					placeholder="Cant of element"
				/>
			</label>
			<FormErrors id="cant" errors={errors} />

			<label className="text-sm font-semibold">
				Cost of each element
				<Input
					name="cost"
					disabled={loading}
					type="number"
					placeholder="Cost of element"
				/>
			</label>
			<FormErrors id="cost" errors={errors} />

			<label className="text-sm font-semibold">
				Select the product to
				<Combobox
					data={products}
					trigger={
						<Button
							variant="outline"
							role="combobox"
							disabled={loading}
							className="w-full justify-between"
						>
							{product
								? products.find((pro) => pro.value === product)?.label
								: "Select product..."}

							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					}
					onSelect={(selected: string) => setProduct(selected)}
				/>
			</label>
			<FormErrors id="product" errors={errors} />

			<Button disabled={loading}>
				{loading ? <Loader2 className="animate-spin" /> : "Add inventory"}
			</Button>
		</>
	);
}
