import { ActionState } from "@/lib/create-safe-action";
import { Sell } from "@prisma/client";
import { z } from "zod";

export const NewSell = z.object({
	selecteds: z.array(
		z.object({
			id: z.number(),
			added: z.number({
				invalid_type_error: "Cant is required",
				required_error: "Cant is required",
			}),
			price: z
				.number({
					required_error: "Price is required",
				})
				.gte(0, "Price must be greater or equal to 0")
				.nullable(),
		})
	),
	id: z
		.number({
			required_error: "Sell area is required",
			invalid_type_error: "Sell area is required",
		})
		.gt(1, "There must be at least one item to sell"),
});

export type InputType = z.infer<typeof NewSell>;
export type ReturnType = ActionState<InputType, Sell[]>;
