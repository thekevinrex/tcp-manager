import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Suspense } from "react";

import { ReelSkeleton } from "@/components/skeletons/reel";
import { Separator } from "@/components/ui/separator";

import { TopOrganizationsSlider } from "../_components/top-org-slider";
import { SearchOrganizations } from "../../_components/search-organizations";

export default function ProductsPage({
	params: { locale },
	searchParams,
}: {
	params: { locale: string };
	searchParams: { q?: string; filters?: string };
}) {
	unstable_setRequestLocale(locale);

	const messages = useMessages();

	const search = searchParams.q ? searchParams.q : "";
	const filters: string[] = [];

	return (
		<div className="flex flex-col w-full">
			<Suspense fallback={<ReelSkeleton />}>
				<TopOrganizationsSlider max={8} />
			</Suspense>

			<Separator className="mb-10 -mt-20" />

			<NextIntlClientProvider messages={{ home: messages.home }}>
				<SearchOrganizations q={search} filters={filters} />
			</NextIntlClientProvider>
		</div>
	);
}
