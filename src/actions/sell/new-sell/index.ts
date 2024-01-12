"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { NewSell, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
import { calcPriceBreakdown } from "@/lib/utils";
import { Berkshire_Swash } from "next/font/google";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const { selecteds, id } = data;

	const area = await db.sellArea.findUnique({
		where: {
			id,
			org: orgId,
		},
	});

	if (!area) {
		return { error: "Area not found" };
	}

	if (selecteds.length <= 0) {
		return { error: "Add at least one item to the sell list" };
	}

	try {
		let transactions = [];

		for (const selected of selecteds) {
			const { added, id, price } = selected;

			const areaProduct = await db.sellAreaProduct.findUnique({
				where: {
					id,
				},
				include: {
					product: {
						include: {
							prices: true,
							inventories: {
								orderBy: {
									id: "asc",
								},
							},
						},
					},
				},
			});

			if (!areaProduct) {
				return {
					error: "Area product not found ",
				};
			}

			if (areaProduct.aviable < added) {
				return {
					error:
						"No can sell more than what is available in product :" +
						areaProduct.product.name,
				};
			}

			// Se wich inventories update
			// itarate for each inventory until is filled
			let selled = 0;
			const inventoriesUpdate: Prisma.InventoryUpdateArgs[] = [];
			const sellOnInventory = [];

			for (const inventory of areaProduct.product.inventories) {
				if (inventory.selled >= inventory.cant) {
					continue;
				}

				const inventoryToSell = inventory.cant - inventory.selled;
				const canSell = added - selled;

				if (canSell <= 0) {
					break;
				}

				let toSell = inventoryToSell;
				if (inventoryToSell > canSell) {
					toSell = canSell;
				}

				selled += toSell;

				inventoriesUpdate.push({
					data: {
						selled: {
							increment: toSell,
						},
					},
					where: {
						id: inventory.id,
					},
				});

				sellOnInventory.push({
					cant: toSell,
					inventoryId: inventory.id,
					price: inventory.total,
				});
			}

			transactions.push(
				db.product.update({
					where: {
						id: areaProduct.productId,
					},
					data: {
						aviable: {
							decrement: added,
						},
						areaProducts: {
							update: {
								where: {
									id: areaProduct.id,
								},
								data: {
									aviable: {
										decrement: added,
									},
								},
							},
						},
						selleds: {
							create: {
								cant: added,
								price:
									price !== null
										? price
										: calcPriceBreakdown({
												product: areaProduct.product,
												total: added,
										  }),
								Area: {
									connect: {
										id: areaProduct.areaId,
									},
								},
								inventories: {
									createMany: {
										data: sellOnInventory,
									},
								},
							},
						},
						inventories: {
							updateMany: inventoriesUpdate,
						},
					},
				})
			);
		}

		await db.$transaction(transactions);

		revalidatePath("/panel/sell-area");

		return { data: [] };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const newSell = createSafeAction(NewSell, handler);
