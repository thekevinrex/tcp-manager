import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

export const CreateSellArea = z.object({});

export type InputType = z.infer<typeof CreateSellArea>;
export type ReturnType = ActionState<InputType, []>;
