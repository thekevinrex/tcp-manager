"use server";

import db from "@/lib/db";

export async function Organizations({
	q,
	page,
	max,
	filters,
}: {
	q?: string;
	page: number;
	max: number;
	filters: string[];
}) {
	try {
		const organizations = await db.organization.findMany({
			where: {
				visible: true,
				name: {
					contains: q ? q : "",
					mode: "insensitive",
				},
			},
			skip: (page - 1) * max,
			take: max,
		});

		return { status: 200, organizations };
	} catch {
		return { error: "An error ocurred", status: 400 };
	}
}
