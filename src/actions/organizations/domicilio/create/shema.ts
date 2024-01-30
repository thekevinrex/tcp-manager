import { ActionState } from "@/lib/create-safe-action";
import { Domicilios } from "@prisma/client";
import { z } from "zod";

export const Domicilio = z.object({
	selecteds: z.array(
		z.object({
			id: z.number({
				required_error: "product_required",
				invalid_type_error: "product_required",
			}),
			added: z
				.number({
					required_error: "cant_required",
					invalid_type_error: "cant_required",
				})
				.gte(1, "cant_gte_1"),
		})
	),
	orgId: z.string({
		required_error: "org_required",
		invalid_type_error: "org_required",
	}),

	phone: z.string({
		required_error: "phone_required",
		invalid_type_error: "phone_required",
	}),
	address: z.string({
		required_error: "address_required",
		invalid_type_error: "address_required",
	}),
});

export type InputType = z.infer<typeof Domicilio>;
export type ReturnType = ActionState<InputType, []>;
