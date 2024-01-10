import { ActionState } from "@/lib/create-safe-action";
import { SellArea } from "@prisma/client";
import { z } from "zod";

export const EditSellArea = z.object({
	id: z.number({
		invalid_type_error: "Sell area is required",
		required_error: "Sell area is required",
	}),
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

export type InputType = z.infer<typeof EditSellArea>;
export type ReturnType = ActionState<InputType, SellArea>;
