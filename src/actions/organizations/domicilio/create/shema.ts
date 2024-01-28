import { ActionState } from "@/lib/create-safe-action";
import { Domicilios } from "@prisma/client";
import { z } from "zod";

export const Domicilio = z.object({
	selecteds: z.array(
		z.object({
			id: z.number(),
			added: z.number(),
		})
	),
	orgId: z.string(),

	phone: z.string(),
	address: z.string(),
});

export type InputType = z.infer<typeof Domicilio>;
export type ReturnType = ActionState<InputType, Domicilios>;
