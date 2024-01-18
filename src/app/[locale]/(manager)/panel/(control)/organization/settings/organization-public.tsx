import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { OrganizationPublicForm } from "../_components/organization-public-form";
import { FetchFailedError } from "@/components/error/FetchFailed";

import { getActualOrganization } from "@/fetchs/organization";

export async function OrganizationPublic() {
	const org = await getActualOrganization();
	const messages = await getMessages();

	if (org.error || !org.data) {
		return <FetchFailedError error={org.error} />;
	}

	return (
		<NextIntlClientProvider messages={{ organization: messages.organization }}>
			<OrganizationPublicForm org={org.data} />
		</NextIntlClientProvider>
	);
}
