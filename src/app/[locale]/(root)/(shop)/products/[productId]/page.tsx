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
		return <FetchFailedError error={"Product no visible"} />;
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

				<OrganizationDetails reverse org={product.organization} />

				<Separator className="my-5" />

				<Suspense fallback={<ReelSkeleton />}>
					<TopProductsSlider not={product.id} />
				</Suspense>
			</div>
		</section>
	);
}
