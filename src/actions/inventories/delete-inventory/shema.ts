import { ActionState } from "@/lib/create-safe-action";
import { Inventory } from "@prisma/client";
import { z } from "zod";

export const DeleteInventory = z.object({
	id: z.number({
		required_error: "Inventory is required",
		invalid_type_error: "Inventory is required",
	}),
});

export type InputType = z.infer<typeof DeleteInventory>;
export type ReturnType = ActionState<InputType, Inventory>;
