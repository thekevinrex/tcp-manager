import { Suspense } from "react";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { ReelSkeleton } from "@/components/skeletons/reel";
import {
	Breadcrumbs,
	BreadcrumbsItem,
	BreadcrumbsLinkItem,
	BreadcrumbsSeparator,
} from "@/components/breadcrumbs";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { OrganizationDetails } from "../../_components/organization-details";

import { getOrganizationBySlug } from "@/fetchs/shop/organizations";

import { TopOrganizationsSlider } from "../_components/top-org-slider";
import { SearchProducts } from "../../_components/search-products";
import { Metadata } from "next";
import { FiltersProducts } from "../../_components/filters-products";

export async function generateMetadata({
	params: { locale, slug },
}: {
	params: { locale: string; slug: string };
}) {
	const t = await getTranslations({ locale, namespace: "header" });

	const response = await getOrganizationBySlug(slug);

	if (response.error || !response.data) {
		return {
			notFound: true,
		};
	}

	const { name, description, email, image, location, phone, visible } =
		response.data;

	if (!visible) {
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
				url: image,
				alt: name,
			},
		},

		openGraph: {
			type: "profile",
			emails: email ? email : undefined,
			url: `${
				process.env.HOST_URL || "http://localhost:3000"
			}/organizations/${slug}`,
			title: name,
			description: description ? description : undefined,
			images: [
				{
					url: image,
					alt: name,
				},
			],
		},
	};

	return metadata;
}

export default async function OrganizationsPage({
	params: { locale, slug },
	searchParams,
}: {
	params: {
		locale: string;
		slug: string;
	};
	searchParams: { q?: string; order?: string; min?: string; max?: string };
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
		return <FetchFailedError error={_("org_no_visible")} />;
	}

	const search = searchParams.q ? searchParams.q : "";
	const filters = {
		order: searchParams.order ? searchParams.order : null,
		min: searchParams.min ? searchParams.min : null,
		max: searchParams.max ? searchParams.max : null,
	};

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

						<NextIntlClientProvider messages={{ home: messages.home }}>
							<FiltersProducts />
						</NextIntlClientProvider>
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
