import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { ReelSkeleton } from "@/components/skeletons/reel";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { TopProductsSlider } from "../_components/top-products-slider";
import { OrganizationDetails } from "../../_components/organization-details";

import { getProduct } from "@/fetchs/shop/products";
import { ProductDetails } from "../../_components/product-details";
import {
	Breadcrumbs,
	BreadcrumbsItem,
	BreadcrumbsLinkItem,
	BreadcrumbsSeparator,
} from "@/components/breadcrumbs";
import { Metadata } from "next";

export async function generateMetadata({
	params: { locale, productId },
}: {
	params: { locale: string; productId: string };
}) {
	const t = await getTranslations({ locale, namespace: "header" });

	const response = await getProduct(Number(productId));

	if (response.error || !response.data) {
		return {
			notFound: true,
		};
	}

	const { organization, description, image, name, id, status } = response.data;

	if (!organization.visible || status === "hidden") {
		return {
			notFound: true,
		};
	}

	const metadata: Metadata = {
		title: name,
		description,

		twitter: {
			title: name,
			description: description ? description : undefined,
			images: {
				url:
					image ||
					`${process.env.HOST_URL || "http://localhost:3000"}/not_image.svg`,
				alt: name,
			},
		},

		openGraph: {
			type: "profile",
			emails: organization.email ? organization.email : undefined,
			url: `${process.env.HOST_URL || "http://localhost:3000"}/products/${id}`,
			title: name,
			description: description ? description : undefined,
			images: [
				{
					url:
						image ||
						`${process.env.HOST_URL || "http://localhost:3000"}/not_image.svg`,
					alt: name,
				},
			],
		},
	};

	return metadata;
}

export default async function ProductPage({
	params: { locale, productId },
}: {
	params: {
		locale: string;
		productId: number;
	};
}) {
	unstable_setRequestLocale(locale);
	const _ = await getTranslations("home");

	const response = await getProduct(Number(productId));

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	const product = response.data;

	if (!product?.organization.visible || product.status === "hidden") {
		return <FetchFailedError error={_("product_no_visible")} />;
	}

	return (
		<section className="flex flex-col mb-20 mt-16 items-center w-full">
			<div className="flex flex-col w-full max-w-screen-xl px-5">
				<header className="pt-8 mb-5">
					<Breadcrumbs>
						<BreadcrumbsLinkItem
							href={`/organizations/${product.organization.slug}`}
						>
							{product.organization.name}
						</BreadcrumbsLinkItem>
						<BreadcrumbsSeparator />
						<BreadcrumbsItem>{product.name}</BreadcrumbsItem>
					</Breadcrumbs>
				</header>
				<ProductDetails product={product} />

				<Separator className="mb-5 mt-2" />

				<OrganizationDetails
					reverse
					org={product.organization}
					productId={product.id}
				/>

				<Separator className="my-5" />

				<Suspense fallback={<ReelSkeleton />}>
					<TopProductsSlider not={product.id} />
				</Suspense>
			</div>
		</section>
	);
}
