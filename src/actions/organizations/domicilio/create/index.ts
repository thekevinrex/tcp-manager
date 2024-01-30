"use server";

import { getTranslations } from "next-intl/server";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { Domicilio, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const _ = await getTranslations("error");

	const { address, orgId, phone, selecteds } = data;

	if (selecteds.length === 0) {
		return { error: _("add_at_least_1") };
	}

	try {
		const org = await db.organization.findUnique({
			where: {
				org: orgId,
			},
			include: {
				products: true,
			},
		});

		if (!org) {
			return { error: _("no_organization") };
		}

		const lastDomicilio = await db.domicilios.findFirst({
			where: {
				org: orgId,
				phone,
			},
			orderBy: {
				id: "desc",
			},
		});

		if (
			lastDomicilio &&
			lastDomicilio?.createdAt.getTime() > Date.now() - 1000 * 60 * 60 * 2
		) {
			return { error: _("domicilio_limit", { horas: 2 }) };
		}

		for (const selected of selecteds) {
			const product = org.products.find((p) => p.id === selected.id);

			if (!product) {
				return { error: _("sell_and_selleds_not_coincide") };
			}

			if (product.aviable === 0) {
				return {
					error: _("sell_product_aviable_more", { name: product.name }),
				};
			}
		}

		const domicilio = await db.domicilios.create({
			data: {
				org: orgId,
				phone,
				address,
				products: JSON.stringify(
					selecteds.map((s) => ({
						id: s.id,
						added: s.added,
					}))
				),
			},
		});

		return { data: [] };
	} catch {
		return { error: _("error") };
	}
};

export const createDomicilio = createSafeAction(Domicilio, handler);
