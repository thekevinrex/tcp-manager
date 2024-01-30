"use client";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormErrors } from "@/components/error/FormErrors";

import { cn } from "@/lib/utils";
import { STATUS } from "@/config/site";
import { ProductsWithAll, StatusType } from "@/lib/types";

import { publicProduct } from "@/actions/products/public-product";
import { useAction } from "@/hooks/useAction";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupabaseImage } from "@/components/Image";

export function ProductPublicSettings({
	product,
}: {
	product: ProductsWithAll;
}) {
	const form = useRef<HTMLFormElement>(null);
	const _ = useTranslations("products");

	const { execute, fieldErrors } = useAction(publicProduct, {
		onSuccess() {
			toast.success(_("product_edited_successfully"));
			form.current?.reset();
		},
		onError(error) {
			toast.error(error);
		},
	});

	const handleSubmit = (formData: FormData) => {
		const description = formData.get("description") as string;
		const status = formData.get("status") as StatusType;

		execute({ id: product.id, description, status, formdata: formData });
	};

	return (
		<form action={handleSubmit} ref={form} className="flex flex-col gap-y-5">
			<ProductBody product={product} errors={fieldErrors} />
		</form>
	);
}

const ProductBody = ({
	errors,
	product,
}: {
	errors: any;
	product: ProductsWithAll;
}) => {
	const { pending: loading } = useFormStatus();
	const _ = useTranslations("products");

	const [radioValue, setRadioValue] = useState(product?.status || "visible");

	const handleRadioChange = (value: any) => {
		setRadioValue(value);
	};

	return (
		<>
			<div className="flex p-2 flex-row justify-between gap-3">
				<div className="size-32 shrink-0 relative flex items-center justify-center rounded-md overflow-hidden">
					<SupabaseImage alt={product.name} product={product} />
				</div>
				<div className="w-full flex-col flex gap-y-2">
					<label className="font-semibold text-sm">
						{_("product_image")}
						<Input
							disabled={loading}
							accept="image/*"
							type="file"
							name="image"
						/>
					</label>
					<FormErrors id="formdata" errors={errors} />

					<p className="text-muted-foreground text-sm">
						{_("product_image_help")}
					</p>
				</div>
			</div>

			<label className="font-semibold text-sm">
				{_("product_des")}
				<Textarea
					disabled={loading}
					defaultValue={product?.description as string}
					name="description"
					placeholder={_("product_des")}
				/>
			</label>
			<FormErrors id="description" errors={errors} />

			<div>
				<span className="font-semibold text-sm">{_("product_visible")}</span>
				<p className="text-xs font-light tracking-wide mb-3">
					{_("product_visible_des")}
				</p>
				<input type="hidden" name="status" value={radioValue} />
				<RadioGroup
					defaultValue={radioValue}
					onValueChange={handleRadioChange}
					className="flex flow-row flex-wrap gap-3 items-center"
				>
					{STATUS.map(({ value, bg }, key) => (
						<label
							key={key}
							className={cn([
								"flex rounded-full text-white text-sm px-2 py-1 gap-3",
								bg,
							])}
						>
							<RadioGroupItem disabled={loading} value={value} />
							<span>{_(value)}</span>
						</label>
					))}
				</RadioGroup>

				<FormErrors id="status" errors={errors} />
			</div>

			<div>
				<Button disabled={loading}>
					{loading ? <Loader2Icon className="animate-spin" /> : _("save")}
				</Button>
			</div>
		</>
	);
};
