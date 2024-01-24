"use server";

import { auth, clerkClient } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { UpgradePlan, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";
import { PLANS } from "@/config/site";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, organization, has } = auth();

	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ role: "org:admin" })) {
		return { error: _("no_permission") };
	}

	const { key } = data;

	const upgradeData = await db.organizationKeys.findFirst({
		where: {
			org: null,
			code: key,
		},
	});

	if (!upgradeData) {
		return { fieldErrors: { key: [_("invalid_key_code")] } };
	}

	if (!Object.keys(PLANS).includes(upgradeData.plan)) {
		return { fieldErrors: { key: [_("invalid_key_code")] } };
	}

	const prevMembers = organization?.maxAllowedMemberships || 1;
	let updatedMemberships = false;

	try {
		const organizationU = await clerkClient.organizations.updateOrganization(
			orgId,
			{
				maxAllowedMemberships: PLANS[upgradeData.plan].members,
			}
		);

		if (!organizationU) {
			return { error: _("error") };
		}

		updatedMemberships = true;

		const [transaction, ...updates] = await db.$transaction([
			db.organizationTransactions.create({
				data: {
					method: "key",
					org: orgId,
					price: 0,
					plan: upgradeData.plan,
				},
			}),
			db.organizationKeys.delete({
				where: {
					id: upgradeData.id,
				},
			}),
			db.organization.update({
				where: {
					org: orgId,
				},
				data: {
					plan: upgradeData.plan,
				},
			}),
		]);

		revalidatePath("/panel/organization/plan");
		return { data: transaction };
	} catch {
		if (updatedMemberships) {
			const organizationU2 = await clerkClient.organizations.updateOrganization(
				orgId,
				{
					maxAllowedMemberships: prevMembers,
				}
			);
		}

		return { error: _("error") };
	}
};

export const upgradePlan = createSafeAction(UpgradePlan, handler);
