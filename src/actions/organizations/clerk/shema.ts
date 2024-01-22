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
	name: z.string(),
	slug: z.string(),
	formdata: z
		.any()
		.nullable()
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return file.size < MAX_FILE_SIZE;
		}, `Max image size is 5MB.`)
		.refine((form) => {
			const file = form.get("image") as File;
			if (!file || file.size <= 0) return true;
			return ACCEPTED_IMAGE_TYPES.includes(file?.type);
		}, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export type InputType = z.infer<typeof Organization>;
export type ReturnType = ActionState<InputType, []>;
