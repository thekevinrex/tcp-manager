import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	ProductsWithPrices,
	SellWithInventories,
	SellWithProductAndInventories,
} from "./types";
import { Prisma } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function calcPriceBreakdown({
	product,
	total,
}: {
	total: number;
	product: ProductsWithPrices;
}): number {
	if (!product.prices || product.prices.length === 0) {
		return product.price;
	}

	let finalPrice = product.price;

	for (const price of product.prices) {
		if (total >= price.cant) {
			finalPrice = price.value;
		}
	}

	return finalPrice;
}

export function formatDate({
	f,
	h = true,
	t = true,
	format,
}: {
	f: Date | string;
	h?: boolean;
	t?: boolean;
	format?: string;
}): string {
	if (!formatDate) {
		return "";
	}

	if (typeof f !== "string") {
		f = f.toISOString();
	}

	const [date, time] = f.split("T");

	const [y, m, d] = date.replaceAll("/", "-").split("-");

	const [hora, minuts] = time.split(":");

	if (format) {
		return format
			.replaceAll(":d", date)
			.replaceAll(":t", `${hora}:${minuts}`)
			.replaceAll(":y", y)
			.replaceAll(":m", m)
			.replaceAll(":d", d)
			.replaceAll(":h", hora)
			.replaceAll(":m", minuts);
	}

	if (!t && h) {
		return date;
	}

	if (!h && t) {
		return `${hora}:${minuts}`;
	}

	return `${date} at ${hora}:${minuts}`;
}

export const Currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export function formatCurrency(amount: number): string {
	return Currency.format(amount);
}

export function calcStadisticsSell(sell: SellWithInventories) {
	const cant = sell.cant;

	let earend = 0;

	for (const inventory of sell.inventories) {
		earend += (sell.price - inventory.price) * inventory.cant;
	}

	const total = sell.cant * sell.price;

	return {
		cant,
		total,
		earend,
	};
}
