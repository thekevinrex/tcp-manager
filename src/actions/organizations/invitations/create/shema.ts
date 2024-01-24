import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const Invitation = z.object({
	email: z.string().email(),
	rol: z.string(),
});

export type InputType = z.infer<typeof Invitation>;
export type ReturnType = ActionState<InputType, []>;
