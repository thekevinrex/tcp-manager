"use server";

import { auth, clerkClient } from "@clerk/nextjs";

import { createSafeAction } from "@/lib/create-safe-action";

import { Invitation, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";
import db from "@/lib/db";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	const { email, rol } = data;

	try {
		const solicitud = await db.solicitudes.findFirst({
			where: {
				email,
			},
		});

		const host = process.env.HOST_URL || "http://localhost:3000";

		let link = `${host}/panel/org-selection`;
		let solicitudId = 0;
		if (!solicitud || solicitud?.user === null) {
			const newSolicitud = await db.solicitudes.create({
				data: {
					email,
					org_type: "cuenta_propia",
					name: "",
					type: "organization",
				},
			});

			solicitudId = newSolicitud.id;
			link = `${host}/sign-up?solicitud=${solicitud?.key}&redirect_url=${link}`;
		} else {
			solicitudId = solicitud.id;
		}

		const invitation =
			await clerkClient.organizations.createOrganizationInvitation({
				emailAddress: email,
				inviterUserId: userId,
				organizationId: orgId,
				role: rol,
				redirectUrl: link,
				publicMetadata: {
					solicitud: solicitudId,
				},
			});

		return { data: [] };
	} catch (err: any) {
		if (err.clerkError) {
			const error = err.errors[0];
			if (error.code === "duplicate_record") {
				return { error: _("invitation_duplicate_record") };
			}
		}

		return { error: _("error") };
	}
};

export const orgInvitation = createSafeAction(Invitation, handler);
