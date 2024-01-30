import { NextIntlClientProvider, useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { ProductNavbar } from "./_components/product-navbar";
import { getProduct } from "@/fetchs/products";
import { Protect } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export async function generateMetadata({
	params: { locale, productId },
}: {
	params: { locale: string; productId: string };
}) {
	const product = await getProduct(parseInt(productId), {
		inventories: false,
		_count: false,
		selleds: false,
	});

	if (product.error || !product.data) {
		return {
			notFound: true,
		};
	}

	return {
		title: product.data.name,
	};
}

export default function ProductLayout({
	params: { locale, productId },
	children,
}: {
	params: { locale: string; productId: string };
	children: React.ReactNode;
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("products");

	return (
		<Protect permission="org:products:read" fallback={<NoPermission />}>
			<div>
				<header className="flex flex-col space-y-3 mb-5">
					<h1 className="text-4xl font-extrabold tracking-tight">
						{_("product_info")}
					</h1>

					<p>{_("product_info_des")}</p>

					<div>
						<NextIntlClientProvider
							messages={{
								labels: {
									stats: _("stadistics"),
									settings: _("settings"),
									home: _("home"),
									sells: _("sells"),
									inventories: _("inventories"),
								},
							}}
						>
							<ProductNavbar productId={productId} />
						</NextIntlClientProvider>
					</div>
				</header>

				{children}
			</div>
		</Protect>
	);
}
