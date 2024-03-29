import { Status, StatusType } from "@/lib/types";

export const SITE = {
	name: "TCP Manager",
	description: "Application to help my father to manage his tcp transport shop",
	creator: "Kevin González Gómez",
	emails: "kevin.bisness010814@gmail.com",
	country: "Cuba",
	authors: {
		name: "Kevin González Gómez",
		url: "https://kevin-portafolio.netlify.app",
	},
};

export const STATUS_TYPES: Array<string> = [
	"hidden",
	"visible",
	"out_stock",
	"admin",
];

export const STATUS: Status[] = [
	{
		value: "hidden",
		bg: "bg-slate-600",
	},
	{
		value: "visible",
		bg: "bg-green-400",
	},
	{
		value: "out_stock",
		bg: "bg-red-500",
	},
];

export const MAX_SELECTEDS = 8;

export const MAX_PRODUCTS_FACTURE = 10;

export const PLANS_USERS: Record<string, { max_org: number }> = {
	cuenta_propia: {
		max_org: 1,
	},
	tcp: {
		max_org: 3,
	},
	mypime: {
		max_org: 10,
	},
};

export const PLANS: Record<string, { max_products: number; members: number }> =
	{
		free: {
			max_products: 5,
			members: 1,
		},
		pro: {
			max_products: 50,
			members: 5,
		},
		unlimited: {
			max_products: -1,
			members: 20,
		},
	};

export const ROLES = [
	{ label: "org:admin", value: "org:admin" },
	{ label: "org:almacenero", value: "org:almacenero" },
	{ label: "org:marketing", value: "org:marketing" },
	{ label: "org:seller", value: "org:seller" },
	{ label: "org:economico", value: "org:economico" },
	{ label: "org:delivery", value: "org:delivery" },
];
