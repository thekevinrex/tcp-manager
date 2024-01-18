import { ActionState } from "@/lib/create-safe-action";
import { OrganizationTransactions } from "@prisma/client";
import { z } from "zod";

export const UpgradePlan = z.object({
	key: z.string(),
});

export type InputType = z.infer<typeof UpgradePlan>;
export type ReturnType = ActionState<InputType, OrganizationTransactions>;
