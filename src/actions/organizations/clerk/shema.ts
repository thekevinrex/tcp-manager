import { ActionState } from "@/lib/create-safe-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const Organization = z.object({
	name: z.string({
		required_error: "name_required",
		invalid_type_error: "name_required",
	}),
	slug: z.string({
		required_error: "slug_required",
		invalid_type_error: "slug_required",
	}),
	formdata: z
		.any()
		.nullable()
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return file.size < MAX_FILE_SIZE;
		}, "max_img_5mb")
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return ACCEPTED_IMAGE_TYPES.includes(file?.type);
		}, "img_file_support"),
});

export type InputType = z.infer<typeof Organization>;
export type ReturnType = ActionState<InputType, []>;
