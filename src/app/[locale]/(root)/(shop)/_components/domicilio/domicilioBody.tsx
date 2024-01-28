import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { ProductsWithPrices } from "@/lib/types";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormErrors } from "@/components/error/FormErrors";

export const DomicilioBody = ({
	products,
	errors,
	addSelected,
}: {
	products: ProductsWithPrices[];
	addSelected: (id: number) => void;
	errors: any;
}) => {
	const { pending: loading } = useFormStatus();
	const _ = useTranslations("home");

	return (
		<>
			<label className="text-sm font-semibold">
				{_("select_product")}
				<Combobox
					data={products.map((product) => {
						return {
							label: product.name,
							value: String(product.id),
						};
					})}
					modal={true}
					search={_("search_command")}
					empty={_("empty_command")}
					trigger={
						<Button
							variant="outline"
							role="combobox"
							disabled={loading}
							className="w-full justify-between"
						>
							{_("select_product")}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					}
					onSelect={(selected: string) => addSelected(parseInt(selected))}
				/>
			</label>
			<FormErrors id="selecteds" errors={errors} />

			<label className="text-sm font-semibold">
				{_("address")}
				<Input
					disabled={loading}
					name="address"
					required
					placeholder={_("address")}
				/>
			</label>
			<FormErrors id="address" errors={errors} />

			<label className="text-sm font-semibold">
				{_("phone")}
				<Input
					disabled={loading}
					name="phone"
					required
					placeholder={_("phone")}
				/>
			</label>
			<FormErrors id="phone" errors={errors} />

			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline" disabled={loading}>
						{_("cancel")}
					</Button>
				</DialogClose>
				<Button disabled={loading}>
					{loading ? <Loader2 className="animate-spin" /> : _("solicitar")}
				</Button>
			</DialogFooter>
		</>
	);
};
