import { getTranslations } from "next-intl/server";
import { OrganizationsReel } from "./_components/organizations-reel";
import { getTopOrganizations } from "@/fetchs/shop/organizations";
import { FetchFailedError } from "@/components/error/FetchFailed";

export async function TopOrganizations() {
	const _ = await getTranslations("home");

	const response = await getTopOrganizations();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	return (
		<OrganizationsReel
			title={_("top_organizations")}
			more={{ label: _("see_more"), href: "/organizations" }}
			organizations={response.data}
		/>
	);
}
