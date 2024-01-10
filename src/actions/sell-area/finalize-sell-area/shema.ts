import { ActionState } from "@/lib/create-safe-action";
import { SellArea } from "@prisma/client";
import { z } from "zod";

export const FinalizeSellArea = z.object({
	id: z.number({
		invalid_type_error: "Sell area is required",
		required_error: "Sell area is required",
	}),
});

export type InputType = z.infer<typeof FinalizeSellArea>;
export type ReturnType = ActionState<InputType, SellArea>;
