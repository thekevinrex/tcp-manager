import db from "@/lib/db";
import { ReturnFetch } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import {
	Organization,
	OrganizationTransactions,
	Solicitudes,
} from "@prisma/client";
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

export async function getOrganizationTransactions(
	org: string
): Promise<ReturnFetch<OrganizationTransactions[]>> {
	const { orgId } = auth();
	const _ = await getTranslations("error");

	if (!orgId) {
		return { error: _("unauthorized") };
	}

	try {
		const transactions = await db.organizationTransactions.findMany({
			where: {
				org,
			},
		});

		return { data: transactions };
	} catch {
		return { error: _("error") };
	}
}

export async function getSolicitudByKey(
	key: string
): Promise<ReturnFetch<Solicitudes>> {
	const _ = await getTranslations("error");

	try {
		const solicitud = await db.solicitudes.findFirst({
			where: {
				key,
			},
		});

		return { data: solicitud };
	} catch {
		return { error: _("error") };
	}
}
