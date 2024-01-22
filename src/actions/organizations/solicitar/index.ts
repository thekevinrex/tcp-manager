"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { Solicitud, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";
import { clerkClient } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
	const _ = await getTranslations("error");

	const { email, name, org_type, phone, proposito } = data;

	const solicitud = await db.solicitudes.findFirst({
		where: {
			email,
		},
	});

	if (solicitud) {
		return { error: _("already_solicitud") };
	}

	try {
		const created = await db.solicitudes.create({
			data: {
				name,
				org_type,
				phone,
				des: proposito,
				email,
			},
		});

		if (!created) {
			return { error: _("error") };
		}

		const redirectUrl = `http://localhost:3000/sign-up?solicitud=${created.key}`;
		// "https://tcp-manager.vercel.app/sign-up?solicitud=" + created.key;

		await clerkClient.invitations.createInvitation({
			emailAddress: email,
			redirectUrl,
			publicMetadata: {
				solicitud: created.id,
			},
			notify: true,
			ignoreExisting: true,
		});

		return { data: created };
	} catch {
		return { error: _("error") };
	}
};

export const solicitarCuenta = createSafeAction(Solicitud, handler);
