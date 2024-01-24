import { Suspense } from "react";
import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { FormSkeleton } from "@/components/skeletons/form";

import { OrganizationPublic } from "./organization-public";
import { OrganizationBasic } from "./organization-basic";
import { Protect } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export default function OrganizationSettings({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("organization");
	const messages = useMessages();

	return (
		<Protect permission="org:settings:manage" fallback={<NoPermission />}>
			<div className="flex flex-col gap-y-10">
				<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
					{_("settings")}
				</h1>

				<section className="rounded-md border p-5">
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-lg md:text-xl font-extrabold tracking-tight">
							{_("settings")}
						</h1>
					</header>

					<NextIntlClientProvider
						messages={{ organization: messages.organization }}
					>
						<OrganizationBasic />
					</NextIntlClientProvider>
				</section>

				<section className="rounded-md border p-5">
					<header className="flex flex-col space-y-3 mb-5">
						<h1 className="text-lg md:text-xl font-extrabold tracking-tight">
							{_("organization_settings")}
						</h1>

						<p>{_("settings_des")}</p>
					</header>
					<Suspense fallback={<FormSkeleton />}>
						<OrganizationPublic />
					</Suspense>
				</section>
			</div>
		</Protect>
	);
}
