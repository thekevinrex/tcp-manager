"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { supabaseServerClient } from "@/lib/supabaseClient";
import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { EditProduct, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
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
		return { error: "Product not found" };
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
		return { error: "Falied to load the supabase client" };
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
		return { error: "An error ocurred" };
	}
};

export const editProduct = createSafeAction(EditProduct, handler);
