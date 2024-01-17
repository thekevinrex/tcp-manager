import db from "@/lib/db";
import { ReturnFetch } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { Organization } from "@prisma/client";
import { getTranslations } from "next-intl/server";

export async function getActualOrganization(): Promise<
	ReturnFetch<Organization>
> {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const org = await db.organization.findUnique({
			where: {
				org: orgId,
			},
		});

		return { data: org };
	} catch {
		return { error: _("error") };
	}
}
