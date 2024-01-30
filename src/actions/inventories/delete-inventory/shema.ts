import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const DeleteInventory = z.object({
	id: z.number({
		required_error: "inventory_required",
		invalid_type_error: "inventory_required",
	}),
});

export type InputType = z.infer<typeof DeleteInventory>;
export type ReturnType = ActionState<InputType, []>;
