"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateProduct, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import { PLANS } from "@/config/site";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId, has } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	if (!has({ permission: "org:products:manage" })) {
		return { error: _("no_permission") };
	}

	const { name, price, prices } = data;

	const organization = await db.organization.findUnique({
		where: {
			org: orgId,
		},
		include: {
			_count: {
				select: {
					products: true,
				},
			},
		},
	});

	if (!organization) {
		return { error: _("unauthorized") };
	}

	const plan = PLANS[organization.plan];

	if (plan.max_products !== -1) {
		if (organization._count.products >= plan.max_products) {
			return { error: _("upgrade_plan_to_create_more_products") };
		}
	}

	const CreateData: Prisma.ProductCreateInput = {
		by_user: userId,
		name,

		organization: {
			connect: {
				org: orgId,
			},
		},

		price,
		status: "hidden",
		prices: {
			createMany: {
				data:
					prices?.map((price) => {
						return { value: price.value, cant: price.cant };
					}) || [],
			},
		},
	};

	try {
		const created = await db.product.create({
			data: CreateData,
		});

		revalidatePath("/panel/products");

		return { data: { productId: created.id } };
	} catch {
		return { error: _("error") };
	}
};

export const createProduct = createSafeAction(CreateProduct, handler);
