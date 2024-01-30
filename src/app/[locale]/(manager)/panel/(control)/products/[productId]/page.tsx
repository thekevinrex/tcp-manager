import { BarChart3, Barcode, CreditCard, Settings2 } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";
import { redirect } from "next/navigation";

import Link from "@/components/link";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { ProductInfo } from "./_components/product-info";
import { getProduct } from "@/fetchs/products";
import { FetchFailedError } from "@/components/error/FetchFailed";

export default async function ProductHome({
	params: { locale, productId },
}: {
	params: { locale: string; productId: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = await getTranslations("products");
	const messages = await getMessages();

	const response = await getProduct(parseInt(productId), {
		inventories: false,
		selleds: false,
		_count: false,
	});

	if (response.error) {
		return <FetchFailedError error={response.error} />;
	}

	if (!response.data) {
		redirect(`/${locale}/panel/products`);
	}

	const LINKS = [
		{
			icon: <BarChart3 />,
			label: _("stadistics"),
			href: `/${locale}/panel/products/${productId}/stats`,
			des: _("stadistics_des"),
		},
		{
			icon: <Settings2 />,
			label: _("settings"),
			href: `/${locale}/panel/products/${productId}/settings`,
			des: _("settings_des"),
		},
		{
			icon: <CreditCard />,
			label: _("sells"),
			href: `/${locale}/panel/products/${productId}/sells`,
			des: _("sells_des"),
		},
		{
			icon: <Barcode />,
			label: _("inventories"),
			href: `/${locale}/panel/products/${productId}/inventories`,
			des: _("inventories_des"),
		},
	];

	return (
		<section className="flex flex-col md:flex-row gap-5 justify-start items-start">
			<div className="w-full md:max-w-sm flex flex-col">
				<NextIntlClientProvider
					messages={{
						products: messages.products,
						alert: messages.alert,
						fieldsErrors: messages.fieldsErrors,
					}}
				>
					<ProductInfo product={response.data} />
				</NextIntlClientProvider>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5 w-full">
				{LINKS.map((link) => {
					return (
						<Link href={link.href} key={link.href}>
							<Card className="hover:shadow-md">
								<CardHeader>
									<CardTitle className="gap-x-3 flex">
										{link.icon} {link.label}
									</CardTitle>
									<CardDescription>{link.des}</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
