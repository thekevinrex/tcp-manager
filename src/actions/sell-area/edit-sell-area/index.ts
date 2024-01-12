"use server";

import { auth } from "@clerk/nextjs";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { EditSellArea, InputType, ReturnType } from "./shema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { selecteds, id } = data;

	for (const selected of selecteds) {
		const product = await db.product.findUnique({
			where: {
				id: selected.id,
			},
		});

		if (!product) {
			return { error: "Product not found" };
		}

		if (product.aviable < selected.cant) {
			return {
				error:
					"total is greater than the aviable of the product" + product.name,
			};
		}
	}

	const areaProducts = await db.sellAreaProduct.findMany({
		where: {
			areaId: id,
		},
	});

	const toCreate = selecteds
		.filter((selected) => {
			return !areaProducts.find((p) => p.productId === selected.id);
		})
		.map((selected) => {
			return { productId: selected.id, aviable: selected.cant };
		});

	const toDelete = areaProducts
		.filter((p) => !selecteds.find((selected) => p.productId === selected.id))
		.map((selected) => selected?.id || 0);

	const toUpdate = areaProducts
		.filter((p) => {
			return selecteds.find((selected) => p.productId === selected.id);
		})
		.map((p) => {
			return {
				where: { id: p.id },
				data: {
					aviable:
						selecteds.find((selected) => p.productId === selected.id)?.cant ||
						p.aviable,
				},
			};
		});

	try {
		const Area = await db.sellArea.update({
			where: {
				id,
			},
			data: {
				Products: {
					deleteMany: {
						id: {
							in: toDelete,
						},
					},
					updateMany: toUpdate,
					createMany: {
						data: toCreate,
					},
				},
			},
		});

		return { data: Area };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const editSellArea = createSafeAction(EditSellArea, handler);
