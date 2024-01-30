import { useFormStatus } from "react-dom";
import { Loader2Icon, Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { Product } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Prices } from "@/lib/types";
import { FormErrors } from "@/components/error/FormErrors";

export const ProductBody = ({
	product,
	prices,
	handlePrices,
	errors,
}: {
	product?: Product;
	prices: Prices[];
	handlePrices: (prices: Prices[]) => void;
	errors?: Record<string, string[] | undefined>;
}) => {
	const _ = useTranslations("products");

	const { pending: loading } = useFormStatus();

	const addBreakdown = () => {
		handlePrices([
			...prices,
			{
				uuid: crypto.randomUUID(),
				value: 0,
				cant: 0,
			},
		]);
	};

	const handleChange = ({
		uuid,
		type,
		value,
	}: {
		uuid: string;
		type: string;
		value: string;
	}) => {
		const price = prices.find((p) => p.uuid === uuid);

		if (price) {
			if (type === "cant") {
				price.cant = Number(value) || 0;
			} else if (type === "price") {
				price.value = Number(value) || 0;
			}
		}

		handlePrices(prices);
	};

	const deleteBreakdown = (uuid: string) => {
		handlePrices(prices.filter((price) => price.uuid !== uuid));
	};

	return (
		<>
			{/* Nombre producto */}
			<label className="font-semibold text-sm">
				{_("product_name")}
				<Input
					name="name"
					disabled={loading}
					required
					defaultValue={product?.name}
					placeholder={_("product_name")}
				/>
			</label>
			<FormErrors id="name" errors={errors} />

			{/* Price producto */}
			<label className="font-semibold text-sm">
				{_("product_price")}
				<Input
					name="price"
					type="number"
					placeholder={_("product_price")}
					required
					defaultValue={product?.price}
					disabled={loading}
				/>
			</label>
			<FormErrors id="price" errors={errors} />

			{/* Price breakdown */}
			<div className="flex items-center py-2 justify-between">
				<div className="flex flex-col">
					<span className="font-semibold text-sm">{_("price_breakdown")}</span>
					<p className="text-xs font-light tracking-wide">
						{_("price_breakdown_des")}
					</p>
				</div>

				<div>
					<Button
						type="button"
						disabled={loading}
						onClick={addBreakdown}
						variant={"ghost"}
					>
						<Plus />
					</Button>
				</div>
			</div>
			<div className="flex flex-col space-y-2">
				{prices?.length > 0 &&
					prices.map(({ cant, value, uuid }) => (
						<div key={uuid} className="flex justify-between gap-2 items-center">
							<Input
								name={"cant_" + uuid}
								type="number"
								placeholder={_("price_breakdown_cant")}
								required
								value={cant}
								onChange={(e) =>
									handleChange({ uuid, type: "cant", value: e.target.value })
								}
								disabled={loading}
							/>
							<Input
								name={"price_" + uuid}
								type="number"
								placeholder={_("price_breakdown_price")}
								required
								value={value}
								onChange={(e) =>
									handleChange({ uuid, type: "price", value: e.target.value })
								}
								disabled={loading}
							/>
							<Button
								type="button"
								onClick={() => deleteBreakdown(uuid)}
								variant={"destructive"}
								className="shrink-0"
								disabled={loading}
							>
								<Trash />
							</Button>
						</div>
					))}
			</div>
			<FormErrors id="prices" errors={errors} />

			<Button disabled={loading}>
				{loading ? <Loader2Icon className="animate-spin" /> : _("save")}
			</Button>
		</>
	);
};
