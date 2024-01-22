import { OrganizationSwitcher } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export const OrganizationHeader = () => {
	const _ = useTranslations("header");

	return (
		<OrganizationSwitcher
			afterSelectPersonalUrl={"/"}
			createOrganizationMode="navigation"
			createOrganizationUrl="/panel/org-create"
			organizationProfileMode="navigation"
			organizationProfileUrl="/panel/organization/settings"
			afterSelectOrganizationUrl={"/panel/org-selection/:id"}
		/>
	);
};
