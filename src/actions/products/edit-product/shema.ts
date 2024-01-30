import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const EditProduct = z.object({
	name: z.string({
		required_error: "name_required",
		invalid_type_error: "name_required",
	}),
	price: z
		.number({
			required_error: "price_required",
			invalid_type_error: "price_required",
		})
		.gt(1, "price_gt_1"),
	prices: z
		.array(
			z.object({
				cant: z
					.number({
						required_error: "cant_required",
						invalid_type_error: "cant_required",
					})
					.gte(1, "cant_gte_1"),
				value: z
					.number({
						required_error: "price_required",
						invalid_type_error: "price_required",
					})
					.gt(1, "price_gt_1"),
			}),
			{
				required_error: "prices_required",
			}
		)
		.nullable(),
	id: z.number({
		required_error: "product_required",
	}),
});

export type InputType = z.infer<typeof EditProduct>;
export type ReturnType = ActionState<InputType, []>;
