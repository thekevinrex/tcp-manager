import { OrganizationPublicForm } from "./_components/organization-public-form";
import { FetchFailedError } from "@/components/error/FetchFailed";

import { getActualOrganization } from "@/fetchs/organization";

export async function OrganizationPublic() {
	const org = await getActualOrganization();

	if (org.error) {
		return <FetchFailedError error={org.error} />;
	}

	return <OrganizationPublicForm org={org.data || null} />;
}
