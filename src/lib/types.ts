import { Prisma } from "@prisma/client";

export type StatusType = "hidden" | "visible" | "out_stock" | "admin";

export type Status = {
	value: StatusType;
	bg: string;
};

export type ProductsWithPrices = Prisma.ProductGetPayload<{
	include: { prices: true };
}>;

export type InventoryWithProduct = Prisma.InventoryGetPayload<{
	include: { Product: true };
}>;

export type ProductsWithPricesAndOrg = Prisma.ProductGetPayload<{
	include: { prices: true; organization: true };
}>;

export type OrganizationWithProducts = Prisma.OrganizationGetPayload<{
	include: { products: true };
}>;

export type SellWithProduct = Prisma.SellGetPayload<{
	include: {
		Product: true;
	};
}>;

export type SellAreaWithTotalSells = Prisma.SellAreaGetPayload<{
	include: {
		_count: {
			select: {
				Sells: true;
			};
		};
	};
}>;

export type SellAreaWithProductAndSells = Prisma.SellAreaGetPayload<{
	include: {
		Sells: {
			include: {
				inventories: true;
			};
		};
	};
}>;

export type SellWithProductAndInventories = Prisma.SellGetPayload<{
	include: {
		Product: {
			select: {
				name: true;
				id: true;
			};
		};
		inventories: true;
	};
}>;

export type SellWithInventories = Prisma.SellGetPayload<{
	include: {
		inventories: true;
	};
}>;

export type Prices = { cant: number; value: number; uuid: string };

export type DataType = {
	value: string;
	label: string;
};

export interface Inventory {
	id?: number;
	productId: number;
	cant: number;
	total: number;
}

export type ReturnFetch<RT> = {
	data?: RT | null;
	error?: string;
	total?: number;
};

export type StaticProductSells = {
	id: number;
	name: string;

	sells: number;
	earned: number;
	total: number;
};
