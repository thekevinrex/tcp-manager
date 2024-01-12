import { ActionState } from "@/lib/create-safe-action";
import { Product } from "@prisma/client";
import { z } from "zod";

export const CreateInventory = z.object({
	product: z.number({
		required_error: "Product is required",
		invalid_type_error: "Product is required",
	}),
	cost: z
		.number({
			required_error: "Cost is required",
			invalid_type_error: "Cost is required",
		})
		.gt(1, "Cost must be greater than 1"),
	cant: z
		.number({
			required_error: "Cant is required",
			invalid_type_error: "Cant is required",
		})
		.gt(0, "Cant must be greater than 0"),
});

export type InputType = z.infer<typeof CreateInventory>;
export type ReturnType = ActionState<InputType, Product>;
