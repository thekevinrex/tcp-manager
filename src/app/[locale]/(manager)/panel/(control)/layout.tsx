import { OrganizationList, Protect, SignedIn } from "@clerk/nextjs";

import { PageHeader } from "./_components/page-header";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const ListOrg = () => {
	return (
		<div className="grid place-content-center w-full h-full min-h-screen">
			<OrganizationList afterSelectPersonalUrl={"/"} />
		</div>
	);
};

export default function ProductLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const messages = useMessages();

	return (
		<Protect permission="org:dashboard:access" fallback={<ListOrg />}>
			<div className="w-full layouts-container gap-6 p-0 sm:p-6">
				<header className="[grid-area:header] border rounded-md sticky top-0 left-0 bg-white dark:bg-slate-900 h-14 z-50">
					<NextIntlClientProvider messages={{ header: messages.header }}>
						<PageHeader />
					</NextIntlClientProvider>
				</header>

				{children}
			</div>
		</Protect>
	);
}
