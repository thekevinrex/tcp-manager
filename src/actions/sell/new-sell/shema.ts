import { ActionState } from "@/lib/create-safe-action";
import { Sell } from "@prisma/client";
import { z } from "zod";

export const NewSell = z.object({
	selecteds: z
		.array(
			z.object({
				id: z.number({
					required_error: "product_required",
					invalid_type_error: "product_required",
				}),
				added: z.number({
					invalid_type_error: "cant_required",
					required_error: "cant_required",
				}),
				price: z
					.number({
						required_error: "price_required",
						invalid_type_error: "price_required",
					})
					.gte(0, "price_gte_0")
					.nullable(),
			})
		)
		.length(1, "sell_add_least_1"),
	id: z.number({
		required_error: "sell_area_required",
		invalid_type_error: "sell_area_required",
	}),
});

export type InputType = z.infer<typeof NewSell>;
export type ReturnType = ActionState<InputType, Sell[]>;
