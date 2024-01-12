"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { DeleteSells, InputType, ReturnType } from "./shema";
import { getActiveArea } from "@/fetchs/sell-area";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		throw new Error("User not authenticated or not in a organization");
	}

	const { sells } = data;

	const area = await getActiveArea();

	if (area.error) {
		return { error: area.error };
	}

	if (!area.data) {
		return { error: "You can only delete sells of the active sell area" };
	}

	try {
		const transactions = [];

		for (const sell of sells) {
			const sellToDelete = await db.sell.findFirst({
				where: {
					id: sell,
					Product: {
						org: orgId,
					},
				},
				include: {
					inventories: true,
				},
			});

			if (!sellToDelete) {
				return { error: "Sell not found" };
			}

			if (sellToDelete.areaId !== area.data.id) {
				return {
					error: "Uno of the sells to delete dont belong to the active area",
				};
			}

			const updateInventory = sellToDelete.inventories
				.filter((invent) => invent.inventoryId !== null)
				.map((inventorySell) => {
					return {
						where: {
							id: inventorySell.inventoryId || 0,
						},
						data: {
							selled: {
								decrement: inventorySell.cant,
							},
						},
					};
				});

			transactions.push(
				db.product.update({
					where: {
						id: sellToDelete.productId,
					},
					data: {
						aviable: {
							increment: sellToDelete.cant,
						},

						selleds: {
							delete: {
								id: sellToDelete.id,
							},
						},

						inventories: {
							updateMany: updateInventory,
						},
					},
				})
			);
		}

		await db.$transaction(transactions);

		revalidatePath(`/panel/area/dashboard/${area.data.id}/sells`);

		return { data: [] };
	} catch {
		return { error: "An error ocurred" };
	}
};

export const deleteSells = createSafeAction(DeleteSells, handler);
