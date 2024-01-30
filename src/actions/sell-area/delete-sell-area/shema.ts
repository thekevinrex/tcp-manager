import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const DeleteSellArea = z.object({
	id: z.number(),
});

export type InputType = z.infer<typeof DeleteSellArea>;
export type ReturnType = ActionState<InputType, []>;
