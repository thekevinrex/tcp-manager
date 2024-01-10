import { OrganizationSwitcher } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";

export const OrganizationHeader = () => {
	return (
		<OrganizationSwitcher
			afterSelectPersonalUrl={"/"}
			afterSelectOrganizationUrl={"/panel/dashboard"}
			afterCreateOrganizationUrl={"/panel/dashboard"}
			afterLeaveOrganizationUrl={"/panel/dashboard"}
		>
			<OrganizationSwitcher.OrganizationProfileLink
				label={"Settings public"}
				url="/panel/organization"
				labelIcon={<ExternalLink width={16} height={16} />}
			></OrganizationSwitcher.OrganizationProfileLink>
		</OrganizationSwitcher>
	);
};
