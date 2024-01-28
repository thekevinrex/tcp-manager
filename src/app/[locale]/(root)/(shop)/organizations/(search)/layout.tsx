import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { Separator } from "@/components/ui/separator";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/breadcrumbs";

import { FiltersOrganizations } from "../_components/filters-organizations";

export default function OrganizationsLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("home");
	const messages = useMessages();

	return (
		<section className="flex flex-col mb-20 mt-16 items-center w-full">
			<div className="flex flex-col w-full max-w-screen-xl px-5">
				<header className="pt-8 pb-5">
					<Breadcrumbs>
						<BreadcrumbsItem>{_("organizations")}</BreadcrumbsItem>
					</Breadcrumbs>
					<h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold tracking-wide mt-6">
						{_("organizations")}
					</h1>
					<p className="max-w-prose tracking-wide text-muted-foreground mb-3">
						{_("organizations_page_des")}
					</p>

					<NextIntlClientProvider messages={{ home: messages.home }}>
						<FiltersOrganizations />
					</NextIntlClientProvider>
				</header>

				<Separator className="mb-5 mt-2" />

				{children}
			</div>
		</section>
	);
}
