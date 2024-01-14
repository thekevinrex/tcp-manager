import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ProductsWithPrices, SellWithInventories } from "./types";

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
	s = false,
	format,
}: {
	f: Date | string;
	h?: boolean;
	t?: boolean;
	format?: string;
	s?: boolean;
}): string {
	if (!f) {
		return "";
	}

	if (typeof f !== "string") {
		f = f.toLocaleString("en-US", {
			timeZone: "America/Havana",
		});
	}

	const [dateR, timeWithM] = f.split(", ");

	const date = dateR.replaceAll("/", "-");
	const [d, m, y] = date.split("-");

	const [time, M] = timeWithM.split(" ");
	const [hora, minuts, segund] = time.split(":");

	if (format) {
		return format
			.replaceAll(":d", date)
			.replaceAll(":t", `${hora}:${minuts}${s ? ":" + s : ""} ${M}`)
			.replaceAll(":y", y)
			.replaceAll(":m", m)
			.replaceAll(":d", d)
			.replaceAll(":h", hora)
			.replaceAll(":m", minuts)
			.replaceAll(":M", M)
			.replaceAll(":s", segund);
	}

	if (!t && h) {
		return date;
	}

	if (!h && t) {
		return `${hora}:${minuts}${s ? ":" + s : ""} ${M}`;
	}

	return `${date} - ${hora}:${minuts}${s ? ":" + s : ""} ${M}`;
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
