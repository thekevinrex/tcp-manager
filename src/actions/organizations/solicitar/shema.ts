import { ActionState } from "@/lib/create-safe-action";
import { Solicitudes } from "@prisma/client";
import { z } from "zod";

export const Solicitud = z.object({
	name: z.string(),
	proposito: z.string(),
	org_type: z.enum(["cuenta_propia", "tcp", "mypime"]),
	email: z.string().email(),
	phone: z.string().nullable(),
});

export type InputType = z.infer<typeof Solicitud>;
export type ReturnType = ActionState<InputType, Solicitudes>;
