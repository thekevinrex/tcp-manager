import db from "@/lib/db";
import { ReturnFetch } from "@/lib/types";
import { Organization } from "@prisma/client";

export async function getTopOrganizations(
	max: number = 8,
	not?: string
): Promise<ReturnFetch<Organization[]>> {
	try {
		// #TODO get top organizations

		const organizations = await db.organization.findMany({
			where: {
				visible: true,
				org: {
					not: not ? not : "",
				},
			},
			take: max,
		});

		return { data: organizations };
	} catch {
		return { error: "An error ocurred" };
	}
}

export async function getOrganizationBySlug(
	slug: string
): Promise<ReturnFetch<Organization>> {
	try {
		const organizations = await db.organization.findFirst({
			where: {
				slug,
			},
			include: {
				products: true,
			},
		});

		return { data: organizations };
	} catch {
		return { error: "An error ocurred" };
	}
}
