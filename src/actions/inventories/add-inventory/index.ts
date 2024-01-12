"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { CreateInventory, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { cant, cost, product: productId } = data;

	const CreateData: Prisma.InventoryCreateInput = {
		cant: cant,
		total: cost,
		Product: {
			connect: {
				id: productId,
			},
		},
	};

	const product = await db.product.findFirst({
		where: {
			id: productId,
		},
	});

	if (!product) {
		return { error: "Product not found" };
	}

	try {
		const [inventory, product] = await db.$transaction([
			db.inventory.create({
				data: CreateData,
			}),

			db.product.update({
				data: {
					aviable: {
						increment: cant,
					},
				},
				where: {
					id: productId,
				},
			}),
		]);

		revalidatePath("/panel/inventory");
		return { data: inventory };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const createInventory = createSafeAction(CreateInventory, handler);
