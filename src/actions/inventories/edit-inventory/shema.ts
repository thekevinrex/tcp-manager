import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const EditInventory = z.object({
	id: z.number({
		required_error: "inventory_required",
	}),
	update_all: z.boolean(),
	cost: z.number({
		required_error: "cost_required",
		invalid_type_error: "cost_required",
	}),
	cant: z
		.number({
			required_error: "cant_required",
			invalid_type_error: "cant_required",
		})
		.nullable(),
});

export type InputType = z.infer<typeof EditInventory>;
export type ReturnType = ActionState<InputType, []>;
