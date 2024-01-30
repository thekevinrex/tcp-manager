import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Protect } from "@clerk/nextjs";

import Organization from "../_components/organization/organization";
import { ActiveArea } from "../_components/active-area";
import { CardSkeleton } from "@/components/skeletons/card";
import { Navbar } from "./_components/navbar";
import { NoPermission } from "@/components/page/no-permission";

export default function OrganizationLayout({
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
			<Protect permission="org:settings:access" fallback={<NoPermission />}>
				<main className="[grid-area:main] flex flex-row md:gap-5 gap-3 items-start justify-start">
					<NextIntlClientProvider
						messages={{ organization: messages.organization }}
					>
						<nav className="sticky top-[80px]">
							<Navbar locale={locale} />
						</nav>
					</NextIntlClientProvider>

					<div className="w-full flex flex-col">{children}</div>
				</main>
			</Protect>
			<aside className="[grid-area:aside]">
				<Suspense fallback={<CardSkeleton />}>
					<ActiveArea />
				</Suspense>

				<NextIntlClientProvider
					messages={{ organization: messages.organization }}
				>
					<Organization />
				</NextIntlClientProvider>
			</aside>
		</>
	);
}
