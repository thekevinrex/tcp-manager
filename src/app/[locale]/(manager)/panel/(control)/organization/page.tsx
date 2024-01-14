import { Suspense } from "react";
import { ActiveArea } from "../_components/active-area";
import { CardSkeleton } from "@/components/skeletons/card";
import { OrganizationPublic } from "./organization-public";
import Organization from "../_components/organization/organization";
import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export default function OrganizationPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = useTranslations("organization");
	const messages = useMessages();
	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-4xl font-extrabold tracking-tight">
							{_("organization")}
						</h1>

						<p>{_("organization_des")}</p>
					</header>

					<Suspense fallback={"loading..."}>
						<OrganizationPublic />
					</Suspense>
				</section>
			</main>

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
