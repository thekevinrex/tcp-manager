import { Suspense } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import Organization from "../_components/organization/organization";
import { CardSkeleton } from "@/components/skeletons/card";
import { ActiveArea } from "../_components/active-area";

export default function Layout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const messages = useMessages();

	return (
		<>
			<main className="[grid-area:main] flex flex-col">{children}</main>

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
