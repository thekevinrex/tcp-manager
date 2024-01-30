"use client";

import Image from "next/image";
import { supabaseBrowserClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";

type ImageProps = {
	product?: { image?: string | null; image_url?: string | null } | null;
	src?: string | null;
	alt: string;
	style?: any;
};

export const SupabaseImage = ({ product, alt }: ImageProps) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [image, setImage] = useState<string | null>(null);

	useEffect(() => {
		async function fetchImage(
			product?: { image?: string | null; image_url?: string | null } | null
		) {
			if (!product?.image && !product?.image_url) {
				setImage("/not_image.svg");
				setLoading(false);
				return;
			}

			if (product.image_url) {
				setImage(product.image_url);
				setLoading(false);
				return;
			}

			if (!product.image) {
				setImage("/not_image.svg");
				setLoading(false);
				return;
			}

			const supabase = await supabaseBrowserClient();

			const response = await supabase?.storage
				.from("products")
				.getPublicUrl(product.image);

			if (!response) {
				setImage("/not_image.svg");
			}

			setImage(response?.data.publicUrl || "/not_image.svg");
			setLoading(false);
		}

		fetchImage(product);
	}, [product]);

	if (loading || !image) {
		return <Skeleton className={cn(`w-full h-full`, "rounded-md")} />;
	}

	return (
		<Image
			src={image}
			alt={alt}
			fill
			sizes="(min-width: 808px) 50vw, 100vw"
			style={{
				objectFit: "fill", // cover, contain, none
			}}
			priority
			className="rounded-md aspect-square"
		/>
	);
};

export function ClerkImage({ src, alt }: ImageProps) {
	return (
		<Image
			src={src || "/not_image.svg"}
			alt={alt}
			fill
			sizes="(min-width: 808px) 50vw, 100vw"
			style={{
				objectFit: "fill", // cover, contain, none
			}}
			priority
			className="rounded-md aspect-square"
		/>
	);
}
