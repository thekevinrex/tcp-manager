import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const DeleteSells = z.object({
	sells: z.array(z.number(), {
		required_error: "Select the sells you want to delete",
	}),
});

export type InputType = z.infer<typeof DeleteSells>;
export type ReturnType = ActionState<InputType, Array<number>>;
