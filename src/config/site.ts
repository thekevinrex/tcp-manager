import { Status, StatusType } from "@/lib/types";

export const SITE = {
	name: "TCP Manager",
	description: "Application to help my father to manage his tcp transport shop",
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
