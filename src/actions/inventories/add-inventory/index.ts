"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateInventory, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ permission: "org:inventories:manage" })) {
		return { error: _("no_permission") };
	}

	const { cant, cost, product: productId } = data;

	try {
		const product = await db.product.findFirst({
			where: {
				org: orgId,
				id: productId,
			},
		});

		if (!product) {
			return { error: _("no_product") };
		}

		const [updated] = await db.$transaction([
			db.product.update({
				data: {
					aviable: {
						increment: cant,
					},
					inventories: {
						create: {
							cant,
							total: cost,
						},
					},
				},
				where: {
					id: productId,
				},
			}),
		]);

		revalidatePath("/panel/inventory");
		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const createInventory = createSafeAction(CreateInventory, handler);
