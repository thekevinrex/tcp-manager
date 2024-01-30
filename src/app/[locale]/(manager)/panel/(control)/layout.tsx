import { OrganizationList, Protect, SignedIn } from "@clerk/nextjs";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { PageHeader } from "./_components/page-header";
import { Footer } from "@/components/page/footer";

const ListOrg = ({ locale }: { locale: string }) => {
	return (
		<div className="grid place-content-center w-full h-full min-h-screen">
			<OrganizationList afterSelectPersonalUrl={`/${locale}`} />
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
		<Protect
			permission="org:dashboard:access"
			fallback={<ListOrg locale={locale} />}
		>
			<div className="w-full layouts-container gap-6 p-3 sm:p-5">
				<header className="[grid-area:header] border rounded-md sticky top-0 left-0 bg-white dark:bg-slate-900 h-14 z-50">
					<NextIntlClientProvider messages={{ header: messages.header }}>
						<PageHeader />
					</NextIntlClientProvider>
				</header>

				{children}
			</div>

			<NextIntlClientProvider
				messages={{ footer: messages.footer, header: messages.header }}
			>
				<div className="w-full mt-10">
					<Footer />
				</div>
			</NextIntlClientProvider>
		</Protect>
	);
}
