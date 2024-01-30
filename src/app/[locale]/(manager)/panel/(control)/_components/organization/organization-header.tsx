"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";

export const OrganizationHeader = () => {
	const _ = useTranslations("header");

	const locale = useLocale();

	return (
		<OrganizationSwitcher
			afterSelectPersonalUrl={`/${locale}`}
			createOrganizationMode="navigation"
			createOrganizationUrl={`/${locale}/panel/org-create`}
			organizationProfileMode="navigation"
			organizationProfileUrl={`/${locale}/panel/organization/settings`}
			afterSelectOrganizationUrl={`/${locale}/panel/org-selection/:id`}
		/>
	);
};
