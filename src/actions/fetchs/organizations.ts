"use server";

import db from "@/lib/db";
import { getTranslations } from "next-intl/server";

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
	const _ = await getTranslations("error");

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
		return { error: _("error"), status: 400 };
	}
}
