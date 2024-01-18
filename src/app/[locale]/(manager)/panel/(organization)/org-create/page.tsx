import { CreateOrganization } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

export default function OrgCreate({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	return (
		<CreateOrganization
			skipInvitationScreen={true}
			afterCreateOrganizationUrl={"/panel/dashboard"}
		/>
	);
}
