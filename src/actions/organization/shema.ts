import { ActionState } from "@/lib/create-safe-action";
import { Organization as OrgType } from "@prisma/client";
import { z } from "zod";

export const Organization = z.object({
	description: z.string().nullable(),
	location: z
		.string({
			required_error: "The location is required",
		})
		.min(1, "The location is required"),
	phone: z
		.string({
			required_error: "The phone is required",
		})
		.min(8, "The phone is required"),
	domicilio: z.boolean({
		required_error: "The domicilio is required",
	}),
	domicilio_details: z.string().nullable(),
	visible: z.boolean({
		required_error: "The visibility is required",
	}),
});

export type InputType = z.infer<typeof Organization>;
export type ReturnType = ActionState<InputType, OrgType>;
