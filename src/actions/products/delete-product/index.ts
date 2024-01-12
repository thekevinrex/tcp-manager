"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import supabaseClient, { supabaseServerClient } from "@/lib/supabaseClient";
import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteProduct, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		throw new Error("User not authenticated or not in a organization");
	}

	const supabase = await supabaseClient();

	if (!supabase) {
		return { error: "Falied to load the supabase client" };
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
			return { error: "Product not found" };
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
		return { error: "An error occurred" };
	}
};

export const deleteProduct = createSafeAction(DeleteProduct, handler);
