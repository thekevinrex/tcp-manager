import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const Visible = z.object({
	products: z.array(z.number()),
	state: z.string(),
});

export type InputType = z.infer<typeof Visible>;
export type ReturnType = ActionState<InputType, []>;
