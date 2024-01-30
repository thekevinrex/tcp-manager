"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { Visible, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ permission: "org:products:manage" })) {
		return { error: _("no_permission") };
	}

	const { products: selecteds, state } = data;

	try {
		const products = await db.product.findMany({
			where: {
				org: orgId,
				id: {
					in: selecteds,
				},
			},
		});

		if (products.length !== selecteds.length) {
			return { error: _("product_and_areaProduct_not_coincide") };
		}

		if (state !== "hidden") {
			for (const product of products) {
				if (product.image === null) {
					return { error: _("at_least_one_product_need_image") };
				}
			}
		}

		const updated = await db.product.updateMany({
			where: {
				id: {
					in: selecteds,
				},
			},
			data: {
				status: state,
			},
		});

		revalidatePath("/panel/products");

		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const changeVisibility = createSafeAction(Visible, handler);
