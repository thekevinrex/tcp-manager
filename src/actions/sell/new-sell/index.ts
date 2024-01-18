"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { NewSell, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";
import { calcPriceBreakdown } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	const { selecteds, id: areaId } = data;

	const area = await db.sellArea.findUnique({
		where: {
			id: areaId,
			org: orgId,
		},
	});

	if (!area) {
		return { error: _("no_area_found") };
	}

	if (selecteds.length <= 0) {
		return { error: _("sell_add_least_1") };
	}

	const productsMap: {
		[key: number]: {
			id: number;
			total: number;
			sells: Array<{ added: number; price: number | null }>;
		};
	} = {};

	for (const selected of selecteds) {
		const product = productsMap[selected.id];

		if (product) {
			product.total += selected.added;

			const productSell = product.sells.find((s) => s.price === selected.price);

			if (productSell) {
				productSell.added += selected.added;
			} else {
				product.sells.push({ added: selected.added, price: selected.price });
			}
		} else {
			productsMap[selected.id] = {
				id: selected.id,
				total: selected.added,
				sells: [{ added: selected.added, price: selected.price }],
			};
		}
	}

	try {
		let transactions = [];
		const productsId = Object.keys(productsMap).map(Number);

		const areaProducts = await db.product.findMany({
			where: {
				id: {
					in: productsId,
				},
			},
			include: {
				prices: true,
				inventories: {
					orderBy: {
						id: "asc",
					},
				},
			},
		});

		if (areaProducts.length !== productsId.length) {
			return { error: _("product_and_areaProduct_not_coincide") };
		}

		for (const areaProduct of areaProducts) {
			const product = productsMap[areaProduct.id];

			if (!product) {
				return {
					error: _("product_invalid"),
				};
			}

			if (areaProduct.aviable < product.total) {
				return {
					error: _("sell_product_aviable_more", { name: areaProduct.name }),
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

			for (const inventory of areaProduct.inventories) {
				if (inventory.selled >= inventory.cant) {
					continue;
				}

				const inventoryToSell = inventory.cant - inventory.selled;

				let selled = 0;

				for (const sell of product.sells) {
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
							price: sell.price === 0 ? 0 : inventory.total,
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
									price: sell.price === 0 ? 0 : inventory.total,
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
						id: areaProduct.id,
					},
					data: {
						aviable: {
							decrement: product.total,
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
							areaId: areaId,
							productId: areaProduct.id,
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
											product: areaProduct,
											total: product.total,
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
		return { error: _("error") };
	}
};

export const newSell = createSafeAction(NewSell, handler);
