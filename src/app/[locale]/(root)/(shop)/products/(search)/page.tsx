import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Suspense } from "react";

import { ReelSkeleton } from "@/components/skeletons/reel";
import { Separator } from "@/components/ui/separator";

import { SearchProducts } from "../../_components/search-products";
import { TopProductsSlider } from "../_components/top-products-slider";

export default function ProductsPage({
	params: { locale },
	searchParams,
}: {
	params: { locale: string };
	searchParams: { q?: string; order?: string; min?: string; max?: string };
}) {
	unstable_setRequestLocale(locale);

	const messages = useMessages();

	const search = searchParams.q ? searchParams.q : "";
	const filters = {
		order: searchParams.order ? searchParams.order : null,
		min: searchParams.min ? searchParams.min : null,
		max: searchParams.max ? searchParams.max : null,
	};

	return (
		<div className="flex flex-col w-full">
			<Suspense fallback={<ReelSkeleton />}>
				<TopProductsSlider max={8} />
			</Suspense>

			<Separator className="mb-10 -mt-20" />

			<NextIntlClientProvider messages={{ home: messages.home }}>
				<SearchProducts q={search} filters={filters} />
			</NextIntlClientProvider>
		</div>
	);
}
