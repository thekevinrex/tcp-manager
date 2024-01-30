import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/combobox";
import { FormErrors } from "@/components/error/FormErrors";
import { DataType } from "@/lib/types";

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
	const _ = useTranslations("inventories");
	const { pending: loading } = useFormStatus();
	return (
		<>
			<label className="text-sm font-semibold">
				{_("inventory_cant")}
				<Input
					name="cant"
					disabled={loading}
					type="number"
					required
					placeholder={_("inventory_cant")}
				/>
			</label>
			<FormErrors id="cant" errors={errors} />

			<label className="text-sm font-semibold">
				{_("inventory_cost")}
				<Input
					name="cost"
					disabled={loading}
					type="number"
					required
					placeholder={_("inventory_cost")}
				/>
			</label>
			<FormErrors id="cost" errors={errors} />

			<label className="text-sm font-semibold">
				{_("inventory_product")}
				<Combobox
					data={products}
					search={_("search_command")}
					empty={_("empty_command")}
					trigger={
						<Button
							variant="outline"
							role="combobox"
							disabled={loading}
							className="w-full justify-between"
						>
							{product
								? products.find((pro) => pro.value === product)?.label
								: _("inventory_product")}

							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					}
					onSelect={(selected: string) => setProduct(selected)}
				/>
			</label>
			<FormErrors id="product" errors={errors} />

			<Button disabled={loading}>
				{loading ? <Loader2 className="animate-spin" /> : _("inventory_add")}
			</Button>
		</>
	);
}
