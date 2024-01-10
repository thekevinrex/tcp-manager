import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const DeleteProduct = z.object({
	products: z.array(z.number(), {
		required_error: "Select the products you want to delete",
	}),
});

export type InputType = z.infer<typeof DeleteProduct>;
export type ReturnType = ActionState<InputType, Array<number>>;
