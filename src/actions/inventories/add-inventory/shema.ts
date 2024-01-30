import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const CreateInventory = z.object({
	product: z.number({
		required_error: "product_required",
		invalid_type_error: "product_required",
	}),
	cost: z.number({
		required_error: "cost_required",
		invalid_type_error: "cost_required",
	}),
	cant: z
		.number({
			required_error: "cant_required",
			invalid_type_error: "cant_required",
		})
		.gt(0, "cant_gte_1"),
});

export type InputType = z.infer<typeof CreateInventory>;
export type ReturnType = ActionState<InputType, []>;
