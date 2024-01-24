"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { Solicitud, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";
import { clerkClient } from "@clerk/nextjs";

const handler = async (data: InputType): Promise<ReturnType> => {
	const _ = await getTranslations("error");

	const create_acount = false;

	if (!create_acount) {
		return { error: _("no_solicitudes_per_now") };
	}

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
				email,
				org_type,

				phone,
				des: proposito,
			},
		});

		if (!created) {
			return { error: _("error") };
		}

		const host = process.env.HOST_URL || "http://localhost:3000";

		const redirectUrl = `${host}/sign-up?solicitud=${created.key}`;

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
