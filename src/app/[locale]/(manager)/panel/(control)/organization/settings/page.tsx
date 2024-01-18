import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { FormSkeleton } from "@/components/skeletons/form";

import { OrganizationPublic } from "./organization-public";

export default function OrganizationSettings({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("organization");

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
					{_("organization_settings")}
				</h1>

				<p>{_("settings_des")}</p>
			</header>

			<Suspense fallback={<FormSkeleton />}>
				<OrganizationPublic />
			</Suspense>
		</section>
	);
}
