"use client";

import Image from "next/image";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type ImageProps = {
	src: string | null;
	alt: string;
	width: number;
	height: number;
	style?: any;
};

export const SupabaseImage = ({
	src,
	alt,
	width,
	height,
	style,
}: ImageProps) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [image, setImage] = useState<string | null>(null);

	useEffect(() => {
		async function fetchImage(src: string | null) {
			if (!src) {
				setImage("/not_image.jpeg");
				setLoading(false);
				return;
			}

			const supabase = await supabaseBrowserClient();

			const response = await supabase?.storage
				.from("products")
				.getPublicUrl(src);

			if (!response) {
				setImage("/not_image.jpeg");
			}

			setImage(response?.data.publicUrl || "/not_image.jpeg");
			setLoading(false);
		}

		fetchImage(src);
	}, [src]);

	if (loading || !image) {
		return (
			<Skeleton
				className={cn(`w-[${width}px] h-[${height}px]`, "rounded-md")}
			/>
		);
	}

	return (
		<Image
			src={image}
			alt={alt}
			width={width}
			height={height}
			className="w-full h-full rounded-md"
			style={style}
		/>
	);
};
