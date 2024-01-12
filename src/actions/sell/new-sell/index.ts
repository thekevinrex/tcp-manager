"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { NewSell, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
import { calcPriceBreakdown } from "@/lib/utils";

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

	const products: Array<{
		id: number;
		total: number;
		sells: Array<{ added: number; price: number | null }>;
	}> = [];

	for (const selected of selecteds) {
		const product = products.find((p) => p.id === selected.id);

		if (product) {
			product.total += selected.added;

			const productSell = product.sells.find((s) => s.price === selected.price);

			if (productSell) {
				productSell.added += selected.added;
			} else {
				product.sells.push({ added: selected.added, price: selected.price });
			}
		} else {
			products.push({
				id: selected.id,
				total: selected.added,
				sells: [{ added: selected.added, price: selected.price }],
			});
		}
	}

	try {
		let transactions = [];

		for (const product of products) {
			const { id, sells, total: added } = product;

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

			const inventoriesUpdate: Prisma.InventoryUpdateArgs[] = [];
			const createSells: Array<{
				price: number | null;
				added: number;
				inventories: Array<any>;
			}> = [];

			for (const inventory of areaProduct.product.inventories) {
				if (inventory.selled >= inventory.cant) {
					continue;
				}

				const inventoryToSell = inventory.cant - inventory.selled;

				let selled = 0;

				for (const sell of sells) {
					const canSell = inventoryToSell - selled;

					if (canSell <= 0) {
						break;
					}

					const createdSelled = createSells.find((s) => s.price === sell.price);
					let toSell = canSell;

					if (createdSelled) {
						if (createdSelled.added === sell.added) {
							continue;
						}

						if (canSell > sell.added - createdSelled.added) {
							toSell = sell.added - createdSelled.added;
						}

						createdSelled.added += toSell;
						createdSelled.inventories.push({
							cant: toSell,
							inventoryId: inventory.id,
							price: inventory.total,
						});
					} else {
						if (canSell > sell.added) {
							toSell = sell.added;
						}

						createSells.push({
							price: sell.price,
							added: toSell,
							inventories: [
								{
									cant: toSell,
									inventoryId: inventory.id,
									price: inventory.total,
								},
							],
						});
					}

					selled += toSell;
				}

				if (selled > 0) {
					inventoriesUpdate.push({
						data: {
							selled: {
								increment: selled,
							},
						},
						where: {
							id: inventory.id,
						},
					});
				} else {
					break;
				}
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
						inventories: {
							updateMany: inventoriesUpdate,
						},
					},
				})
			);

			for (const sell of createSells) {
				transactions.push(
					db.sell.create({
						data: {
							areaId: areaProduct.areaId,
							productId: areaProduct.productId,
							cant: sell.added,
							inventories: {
								createMany: {
									data: sell.inventories,
								},
							},
							price:
								sell.price !== null
									? sell.price
									: calcPriceBreakdown({
											product: areaProduct.product,
											total: added,
									  }),
						},
					})
				);
			}
		}

		await db.$transaction(transactions);

		revalidatePath("/panel/sell-area");

		return { data: [] };
	} catch {
		return { error: "An error occurred" };
	}
};

export const newSell = createSafeAction(NewSell, handler);
