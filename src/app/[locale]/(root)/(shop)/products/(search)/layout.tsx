import { Separator } from "@/components/ui/separator";
import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { FiltersProducts } from "../../_components/filters-products";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/breadcrumbs";

export default function ProductLayout({
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
						<BreadcrumbsItem>{_("products")}</BreadcrumbsItem>
					</Breadcrumbs>
					<h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold tracking-wide mt-6">
						{_("products")}
					</h1>
					<p className="max-w-prose tracking-wide text-muted-foreground mb-3">
						{_("products_page_des")}
					</p>

					<NextIntlClientProvider messages={{ home: messages.home }}>
						<FiltersProducts />
					</NextIntlClientProvider>
				</header>

				<Separator className="mb-5 mt-2" />

				{children}
			</div>
		</section>
	);
}
