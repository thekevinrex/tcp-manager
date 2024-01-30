import { Protect } from "@clerk/nextjs";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { CreateProduct } from "./create-product";
import { Organization } from "../_components/organization/organization";

export default function ProductsLayout({
	params: { locale },
	children,
}: {
	params: { locale: string };
	children: React.ReactNode;
}) {
	unstable_setRequestLocale(locale);
	const messages = useMessages();

	return (
		<>
			{children}

			<aside className="[grid-area:aside]">
				<NextIntlClientProvider
					messages={{
						organization: messages.organization,
						products: messages.products,
						fieldsErrors: messages.fieldsErrors,
					}}
				>
					<Protect permission="org:products:manage">
						<CreateProduct />
					</Protect>
					<Organization />
				</NextIntlClientProvider>
			</aside>
		</>
	);
}
