"use server";

import { auth } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { Organization, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();

	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ permission: "org:settings:manage" })) {
		return { error: _("no_permission") };
	}

	const {
		description,
		domicilio,
		domicilio_details,
		location,
		phone,
		visible,
	} = data;

	try {
		const org = await db.organization.findUnique({
			where: {
				org: orgId,
			},
		});

		if (!org) {
			return { error: _("no_organization") };
		}

		const Organization = await db.organization.update({
			where: {
				org: orgId,
			},
			data: {
				description,
				phone,
				location,
				domicilio: domicilio,
				domicilio_details,
				visible,
			},
		});

		return { data: Organization };
	} catch {
		return { error: _("error") };
	}
};

export const organization = createSafeAction(Organization, handler);
