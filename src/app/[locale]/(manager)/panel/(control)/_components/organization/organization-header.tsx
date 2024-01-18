import { OrganizationSwitcher } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export const OrganizationHeader = () => {
	const _ = useTranslations("header");

	return (
		<OrganizationSwitcher
			afterSelectPersonalUrl={"/"}
			createOrganizationMode="navigation"
			createOrganizationUrl="/panel/org-create"
		>
			<OrganizationSwitcher.OrganizationProfileLink
				label={_("public_settings")}
				url="/panel/organization"
				labelIcon={<ExternalLink width={16} height={16} />}
			></OrganizationSwitcher.OrganizationProfileLink>
		</OrganizationSwitcher>
	);
};
