import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const Invitation = z.object({
	email: z
		.string({
			required_error: "email_required",
			invalid_type_error: "email_required",
		})
		.email("email_required"),
	rol: z.string({
		required_error: "rol_required",
		invalid_type_error: "rol_required",
	}),
});

export type InputType = z.infer<typeof Invitation>;
export type ReturnType = ActionState<InputType, []>;
