import { ActionState } from "@/lib/create-safe-action";
import { OrganizationTransactions } from "@prisma/client";
import { z } from "zod";

export const UpgradePlan = z.object({
	key: z.string({
		required_error: "key_required",
		invalid_type_error: "key_required",
	}),
});

export type InputType = z.infer<typeof UpgradePlan>;
export type ReturnType = ActionState<InputType, OrganizationTransactions>;
