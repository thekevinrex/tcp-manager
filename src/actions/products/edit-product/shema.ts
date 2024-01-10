import { ActionState } from "@/lib/create-safe-action";
import { Product } from "@prisma/client";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const EditProduct = z.object({
	name: z.string({
		required_error: "Name is required",
		invalid_type_error: "Name is required",
	}),
	price: z
		.number({
			required_error: "Price is required",
			invalid_type_error: "Price is required",
		})
		.gt(1, "Price must be greater than 1"),
	status: z.enum(["out_stock", "admin", "visible", "hidden"], {
		required_error: "Status is required",
		invalid_type_error: "Status is required",
	}),
	description: z
		.string({
			required_error: "Description is required",
		})
		.nullable(),
	id: z.number(),
	prices: z
		.array(
			z.object({
				cant: z.number().gt(1),
				value: z.number().gt(1),
			}),
			{
				required_error: "Prices is required",
			}
		)
		.nullable(),
	formdata: z
		.any()
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return file.size < MAX_FILE_SIZE;
		}, `Max image size is 5MB.`)
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return ACCEPTED_IMAGE_TYPES.includes(file?.type);
		}, "Only .jpg, .jpeg, .png and .webp formats are supported.")
		.nullable(),
});

export type InputType = z.infer<typeof EditProduct>;
export type ReturnType = ActionState<InputType, Product>;
