"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { UpgradePlan, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";
import { PLANS } from "@/config/site";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
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

	try {
		const [transaction, ...updates] = await db.$transaction([
			db.organizationTransactions.create({
				data: {
					method: "key",
					org: orgId,
					price: 0,
					plan: upgradeData.plan,
				},
			}),
			db.organizationKeys.update({
				where: {
					id: upgradeData.id,
				},
				data: {
					org: orgId,
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
		return { error: _("error") };
	}
};

export const upgradePlan = createSafeAction(UpgradePlan, handler);
