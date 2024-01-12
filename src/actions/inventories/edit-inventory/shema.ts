import { ActionState } from "@/lib/create-safe-action";
import { Inventory } from "@prisma/client";
import { z } from "zod";

export const EditInventory = z.object({
	id: z.number({
		required_error: "The inventory is required",
	}),
	update_all: z.boolean(),
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
		.nullable(),
});

export type InputType = z.infer<typeof EditInventory>;
export type ReturnType = ActionState<InputType, Inventory>;
