import db from "@/lib/db";
import { ReturnFetch } from "@/lib/types";
import { auth } from "@clerk/nextjs";
import { Organization } from "@prisma/client";

export async function getActualOrganization(): Promise<
	ReturnFetch<Organization>
> {
	const { orgId } = auth();

	if (!orgId) {
		return { error: "Unauthorized" };
	}

	try {
		const org = await db.organization.findUnique({
			where: {
				org: orgId,
			},
		});

		return { data: org };
	} catch {
		return { error: "An error ocurred" };
	}
}
