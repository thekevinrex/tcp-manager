import { OrganizationList } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

export default function OrgSelection({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<OrganizationList
			afterSelectOrganizationUrl={`/${locale}/panel/org-selection/:id`}
			afterCreateOrganizationUrl={`/${locale}/panel/org-selection/:id`}
			skipInvitationScreen={true}
			afterSelectPersonalUrl={`/${locale}`}
		/>
	);
}
