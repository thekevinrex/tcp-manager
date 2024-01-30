import { ActionState } from "@/lib/create-safe-action";
import { Organization as OrgType } from "@prisma/client";
import { z } from "zod";

export const Organization = z.object({
	description: z
		.string({
			required_error: "des_required",
			invalid_type_error: "des_required",
		})
		.nullable(),
	location: z
		.string({
			required_error: "location_required",
			invalid_type_error: "location_required",
		})
		.min(1, "location_required"),
	phone: z
		.string({
			required_error: "phone_required",
			invalid_type_error: "phone_required",
		})
		.min(8, "phone_required"),
	domicilio: z.boolean({
		required_error: "domicilio_required",
		invalid_type_error: "domicilio_required",
	}),
	domicilio_details: z.string().nullable(),
	visible: z.boolean({
		required_error: "visibility_required",
	}),
});

export type InputType = z.infer<typeof Organization>;
export type ReturnType = ActionState<InputType, OrgType>;
