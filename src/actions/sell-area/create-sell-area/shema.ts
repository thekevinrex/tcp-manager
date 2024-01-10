import { ActionState } from "@/lib/create-safe-action";
import { SellArea } from "@prisma/client";
import { z } from "zod";

export const CreateSellArea = z.object({
	selecteds: z.array(
		z.object({
			id: z.number(),
			cant: z.number({
				invalid_type_error: "Cant is required",
				required_error: "Cant is required",
			}),
		})
	),
});

export type InputType = z.infer<typeof CreateSellArea>;
export type ReturnType = ActionState<InputType, SellArea>;
