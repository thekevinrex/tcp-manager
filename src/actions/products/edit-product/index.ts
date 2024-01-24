"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { supabaseServerClient } from "@/lib/supabaseClient";
import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { EditProduct, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
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

	const { id, description, name, price, status, prices } = data;

	const product = await db.product.findFirst({
		where: {
			id: id,
			org: orgId,
		},
		include: {
			prices: true,
		},
	});

	if (!product) {
		return { error: _("no_product") };
	}

	const CreateData: Prisma.ProductUpdateInput = {
		name,
		description,
		price,
		status,
		prices: {
			deleteMany: {},
			createMany: {
				data: prices
					? prices.map((price) => {
							return { value: price.value, cant: price.cant };
					  })
					: [],
			},
		},
	};

	const supabase = await supabaseServerClient();

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
			return { error: error.message };
		}

		CreateData.image = data.path;
	}

	try {
		const updated = await db.product.update({
			where: {
				id: id,
			},
			data: CreateData,
		});

		if (CreateData.image && product.image && product.image !== "") {
			await supabase.storage.from("products").remove([product.image]);
		}

		revalidatePath("/panel/products");
		return { data: updated };
	} catch {
		return { error: _("error") };
	}
};

export const editProduct = createSafeAction(EditProduct, handler);
