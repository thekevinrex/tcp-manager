"use server";

import { auth, clerkClient } from "@clerk/nextjs";

import { createSafeAction } from "@/lib/create-safe-action";

import { Invitation, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ role: "org:settings:member" })) {
		return { error: _("no_permission") };
	}

	const { id } = data;

	try {
		const invitation =
			await clerkClient.organizations.revokeOrganizationInvitation({
				invitationId: id,
				organizationId: orgId,
				requestingUserId: userId,
			});

		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const revokeInvitation = createSafeAction(Invitation, handler);
