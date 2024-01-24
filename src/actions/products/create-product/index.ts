"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import supabaseClient from "@/lib/supabaseClient";
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

	const { description, name, price, status, prices } = data;

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
		description,
		price,
		status,
		prices: {
			createMany: {
				data:
					prices?.map((price) => {
						return { value: price.value, cant: price.cant };
					}) || [],
			},
		},
	};

	const supabase = await supabaseClient();

	if (!supabase) {
		return { error: _("failed_supabase_client") };
	}

	const uuid = crypto.randomUUID();
	const file = data.formdata.get("image") as File;

	if (file !== null && file.size > 0) {
		const filename = uuid + "_" + file.name;

		const { data, error } = await supabase.storage
			.from("products")
			.upload(filename, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (!data || error) {
			return { error: _("error") };
		}

		CreateData.image = data.path;
	}

	try {
		const created = await db.product.create({
			data: CreateData,
		});

		revalidatePath("/panel/products");

		return { data: created };
	} catch {
		return { error: _("error") };
	}
};

export const createProduct = createSafeAction(CreateProduct, handler);
