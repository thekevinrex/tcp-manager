import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const EditProduct = z.object({
	id: z.number({
		required_error: "product_required",
	}),

	status: z.enum(["out_stock", "admin", "visible", "hidden"], {
		required_error: "status_required",
		invalid_type_error: "status_required",
	}),
	description: z.string({
		required_error: "des_required",
		invalid_type_error: "des_required",
	}),

	formdata: z
		.any()
		.nullable()
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return file.size < MAX_FILE_SIZE;
		}, `max_img_5mb`)
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return ACCEPTED_IMAGE_TYPES.includes(file?.type);
		}, "img_file_support"),
});

export type InputType = z.infer<typeof EditProduct>;
export type ReturnType = ActionState<InputType, []>;
