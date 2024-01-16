import { Suspense } from "react";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { ReelSkeleton } from "@/components/skeletons/reel";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { OrganizationDetails } from "../../_components/organization-details";

import { getProduct } from "@/fetchs/shop/products";

import {
	Breadcrumbs,
	BreadcrumbsItem,
	BreadcrumbsLinkItem,
	BreadcrumbsSeparator,
} from "@/components/breadcrumbs";
import { getOrganizationBySlug } from "@/fetchs/shop/organizations";
import { TopOrganizationsSlider } from "../_components/top-org-slider";
import { NextIntlClientProvider } from "next-intl";
import { SearchOrganizations } from "../../_components/search-organizations";
import { SearchProducts } from "../../_components/search-products";

export default async function OrganizationsPage({
	params: { locale, slug },
}: {
	params: {
		locale: string;
		slug: string;
	};
}) {
	unstable_setRequestLocale(locale);
	const _ = await getTranslations("home");
	const messages = await getMessages();

	const response = await getOrganizationBySlug(slug);

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	const organization = response.data;

	if (!organization.visible) {
		return <FetchFailedError error={"Organization no visible"} />;
	}

	const search = "";
	const filters = [""];

	return (
		<div className="flex flex-col mb-20 mt-16 items-center w-full">
			<div className="flex flex-col w-full max-w-screen-xl px-5">
				<section className="w-full">
					<header className="pt-8 mb-5">
						<Breadcrumbs>
							<BreadcrumbsLinkItem href={`/organizations`}>
								{_("organizations")}
							</BreadcrumbsLinkItem>
							<BreadcrumbsSeparator />
							<BreadcrumbsItem>{organization.name}</BreadcrumbsItem>
						</Breadcrumbs>
					</header>
					<OrganizationDetails org={organization} />
				</section>
				<Separator className="my-2" />

				<section className="flex flex-col w-full">
					<header className="mb-5">
						<h1 className="text-xl md:text-3xl lg:text-4xl font-semibold tracking-wide mt-6">
							{_("organization_products")}
						</h1>
						<p className="max-w-prose tracking-wide text-muted-foreground mb-3">
							{_("organization_products_des")}
						</p>
					</header>

					<NextIntlClientProvider messages={{ home: messages.home }}>
						<SearchProducts
							q={search}
							filters={filters}
							org={organization.org}
						/>
					</NextIntlClientProvider>
				</section>

				<Separator className="my-5" />

				<Suspense fallback={<ReelSkeleton />}>
					<TopOrganizationsSlider not={organization.org} />
				</Suspense>
			</div>
		</div>
	);
}
