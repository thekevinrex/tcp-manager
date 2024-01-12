"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import supabaseClient from "@/lib/supabaseClient";
import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateProduct, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { description, name, price, status, prices } = data;

	const productName = await db.product.findFirst({
		where: {
			name,
			org: orgId,
		},
	});

	if (productName) {
		return { error: "That product is already in the organization" };
	}

	const CreateData: Prisma.ProductCreateInput = {
		by_user: userId,
		org: orgId,
		name,
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
		const created = await db.product.create({
			data: CreateData,
		});

		revalidatePath("/products");
		return { data: created };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const createProduct = createSafeAction(CreateProduct, handler);
