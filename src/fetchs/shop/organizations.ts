import db from "@/lib/db";
import { ReturnFetch } from "@/lib/types";
import { Organization } from "@prisma/client";

export async function getTopOrganizations(
	max: number = 8
): Promise<ReturnFetch<Organization[]>> {
	try {
		// #TODO get top organizations

		const organizations = await db.organization.findMany({
			where: {
				visible: true,
			},
			take: max,
		});

		return { data: organizations };
	} catch {
		return { error: "An error ocurred" };
	}
}
