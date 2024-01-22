"use server";

import { auth, clerkClient } from "@clerk/nextjs";

import { createSafeAction } from "@/lib/create-safe-action";

import { Organization, InputType, ReturnType } from "./shema";
import { getTranslations } from "next-intl/server";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();
	const _ = await getTranslations("error");

	if (!userId || !orgId) {
		return { error: _("unauthorized") };
	}

	const { name, slug, formdata } = data;

	try {
		const file = data.formdata.get("image") as File;

		if (file !== null && file.size > 0) {
			const logo = await clerkClient.organizations.updateOrganizationLogo(
				orgId,
				{
					file: file,
					uploaderUserId: userId,
				}
			);
		}

		const org = await clerkClient.organizations.updateOrganization(orgId, {
			name,
			slug,
		});

		console.log(org.slug);

		return { data: [] };
	} catch (err: any) {
		if (err.clerkError) {
			const fieldErrors: Record<string, string[]> = {};

			err.errors.forEach((e: any) => {
				fieldErrors[e.meta.paramName] = [e.longMessage];
			});

			console.log(fieldErrors);

			return { fieldErrors };
		}

		return { error: _("error") };
	}
};

export const clerkOrganization = createSafeAction(Organization, handler);
