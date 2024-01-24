"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import supabaseClient, { supabaseServerClient } from "@/lib/supabaseClient";
import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteProduct, InputType, ReturnType } from "./shema";
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

	const supabase = await supabaseClient();

	if (!supabase) {
		return { error: _("failed_supabase_client") };
	}

	const { products } = data;
	const images = [];

	for (const product of products) {
		const productImage = await db.product.findUnique({
			where: {
				org: orgId,
				id: product,
			},
			select: {
				image: true,
			},
		});

		if (!productImage) {
			return { error: _("no_product") };
		}

		if (productImage.image && productImage.image !== "") {
			images.push(productImage.image);
		}
	}

	try {
		await db.product.deleteMany({
			where: {
				id: {
					in: products,
				},
			},
		});

		await supabase.storage.from("products").remove(images);

		revalidatePath("/panel/products");

		return { data: products };
	} catch {
		return { error: _("error") };
	}
};

export const deleteProduct = createSafeAction(DeleteProduct, handler);
