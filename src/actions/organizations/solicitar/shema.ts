import { ActionState } from "@/lib/create-safe-action";
import { Solicitudes } from "@prisma/client";
import { z } from "zod";

export const Solicitud = z.object({
	name: z.string({
		required_error: "name_required",
		invalid_type_error: "name_required",
	}),
	proposito: z.string({
		required_error: "propo_required",
		invalid_type_error: "propo_required",
	}),
	org_type: z.enum(["cuenta_propia", "tcp", "mypime"]),
	email: z
		.string({
			required_error: "email_required",
			invalid_type_error: "email_required",
		})
		.email({
			message: "email_required",
		}),
	phone: z
		.string({
			required_error: "phone_required",
			invalid_type_error: "phone_required",
		})
		.nullable(),
});

export type InputType = z.infer<typeof Solicitud>;
export type ReturnType = ActionState<InputType, Solicitudes>;
