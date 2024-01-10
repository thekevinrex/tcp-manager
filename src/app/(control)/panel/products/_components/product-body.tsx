import { useFormStatus } from "react-dom";
import { Loader2Icon, Trash } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Product } from "@prisma/client";
import { Prices } from "@/lib/types";
import { STATUS } from "@/config/site";
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
	const { pending: loading } = useFormStatus();
	const [radioValue, setRadioValue] = useState(product?.status || "visible");

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

	const handleRadioChange = (value: any) => {
		setRadioValue(value);
	};

	return (
		<>
			{/* Nombre producto */}
			<label className="font-semibold text-sm">
				Product Name
				<Input
					name="name"
					disabled={loading}
					required
					defaultValue={product?.name}
					placeholder="Product Name"
				/>
			</label>
			<FormErrors id="name" errors={errors} />

			{/* Price producto */}
			<label className="font-semibold text-sm">
				Product Price
				<Input
					name="price"
					type="number"
					pattern="00,99"
					placeholder="Product Price"
					required
					defaultValue={product?.price}
					disabled={loading}
				/>
			</label>
			<FormErrors id="price" errors={errors} />

			{/* Price breakdown */}
			<div className="flex items-center py-2 justify-between">
				<div className="flex flex-col">
					<span className="font-semibold text-sm">Price breakdown</span>
					<p className="text-xs font-light tracking-wide">
						You can add price breakdown for diferents price for a prduct
						acording to the cant
					</p>
				</div>

				<div>
					<Button
						type="button"
						disabled={loading}
						onClick={addBreakdown}
						variant={"ghost"}
					>
						Add breakdown
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
								placeholder="Product Breakdown cant"
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
								placeholder="Product Breakdown Price"
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

			{/* Image producto */}
			<label className="font-semibold text-sm">
				Product Image
				<Input disabled={loading} accept="image/*" type="file" name="image" />
			</label>
			<FormErrors id="formdata" errors={errors} />

			<label className="font-semibold text-sm">
				Product description
				<Textarea
					disabled={loading}
					defaultValue={product?.description as string}
					name="description"
					placeholder="Product description"
				/>
			</label>
			<FormErrors id="description" errors={errors} />

			<div>
				<span className="font-semibold text-sm">Product visibility</span>
				<p className="text-xs font-light tracking-wide mb-3">
					This is the visibility of the product in the product landing page
				</p>
				<input type="hidden" name="status" value={radioValue} />
				<RadioGroup
					defaultValue={radioValue}
					onValueChange={handleRadioChange}
					className="flex flow-row flex-wrap gap-3 items-center"
				>
					{STATUS.map(({ value, label, bg }, key) => (
						<label
							key={key}
							className={cn([
								"flex rounded-full text-white text-sm px-2 py-1 gap-3",
								bg,
							])}
						>
							<RadioGroupItem disabled={loading} value={value} />
							<span>{label}</span>
						</label>
					))}
				</RadioGroup>
				<FormErrors id="status" errors={errors} />
			</div>

			<Button disabled={loading}>
				{loading ? <Loader2Icon className="animate-spin" /> : "Save"}
			</Button>
		</>
	);
};
